#!/usr/bin/env bash
# =============================================================================
# deploy.sh — Despliegue del frontend en Ubuntu (danielwar.tech)
#
# Arquitectura:
#   - Next.js corre en Docker en el puerto 127.0.0.1:3001
#   - El nginx del HOST hace de proxy inverso hacia ese puerto
#   - NO se levanta un nginx dentro de Docker (el puerto 80/443 ya lo usa el host)
#
# Uso:
#   bash deploy.sh              → primer despliegue o actualización
#   bash deploy.sh --no-build   → solo reiniciar contenedor sin rebuild
# =============================================================================
set -euo pipefail

# ─── Colores ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
info()    { echo -e "${GREEN}[✔]${NC} $*"; }
warn()    { echo -e "${YELLOW}[!]${NC} $*"; }
error()   { echo -e "${RED}[✘]${NC} $*" >&2; exit 1; }
section() { echo -e "\n${CYAN}══ $* ══${NC}"; }

# ─── Configuración fija del proyecto ─────────────────────────────────────────
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOMAIN="danielwar.tech"
FRONTEND_PORT="3001"
NGINX_SITE="/etc/nginx/sites-available/${DOMAIN}"
NGINX_ENABLED="/etc/nginx/sites-enabled/${DOMAIN}"
CERT_PATH="/etc/letsencrypt/live/${DOMAIN}"
NO_BUILD=false

# ─── Flags ────────────────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case $1 in
    --no-build) NO_BUILD=true; shift ;;
    *) error "Flag desconocido: $1" ;;
  esac
done

cd "$APP_DIR"

# ─── 1. Verificar prerequisitos ───────────────────────────────────────────────
section "Verificando prerequisitos"

command -v docker      &>/dev/null || error "Docker no está instalado."
docker compose version &>/dev/null || error "docker compose plugin no encontrado."
command -v nginx       &>/dev/null || error "Nginx no está instalado en el host."

if ! docker info &>/dev/null; then
  error "No tienes permisos para usar Docker. Ejecuta: sudo usermod -aG docker \$USER && newgrp docker"
fi

info "Docker: $(docker --version)"
info "Nginx:  $(nginx -v 2>&1)"

# ─── 2. Actualizar código fuente ──────────────────────────────────────────────
section "Actualizando código fuente"

# Guardar cambios locales que no queremos perder (solo .env)
if git diff --quiet HEAD -- . ':!.env' ':!nginx/certs'; then
  info "Sin cambios locales relevantes."
else
  warn "Hay cambios locales (distintos de .env y certs). Haciendo stash..."
  git stash push -m "deploy-auto-stash" -- ':!.env' ':!nginx/certs'
fi

git fetch origin
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse "origin/master")

if [[ "$LOCAL" == "$REMOTE" ]]; then
  info "Código ya está al día ($(git rev-parse --short HEAD))."
else
  info "Actualizando: $(git rev-parse --short HEAD) → $(git rev-parse --short origin/master)"
  git pull origin master
fi

# ─── 3. Verificar .env ────────────────────────────────────────────────────────
section "Verificando .env"

if [[ ! -f "$APP_DIR/.env" ]]; then
  if [[ -f "$APP_DIR/.env.production.example" ]]; then
    cp "$APP_DIR/.env.production.example" "$APP_DIR/.env"
    warn ".env creado desde .env.production.example"
    warn "Edita $APP_DIR/.env con los valores correctos y vuelve a ejecutar deploy.sh"
    exit 0
  else
    error "No existe .env en $APP_DIR"
  fi
fi

# Validar variables mínimas requeridas
REQUIRED_VARS=("REACT_API_HOST" "NEXT_PUBLIC_BACKEND_URL")
for var in "${REQUIRED_VARS[@]}"; do
  grep -q "^${var}=" "$APP_DIR/.env" || error "Variable $var no definida en .env"
done
info ".env ok"

# ─── 4. Configurar nginx del host ─────────────────────────────────────────────
section "Configurando nginx del host"

# Si aún no hay certificado, escribir config HTTP-only para que certbot pueda validar
if ! sudo test -f "${CERT_PATH}/fullchain.pem"; then
  warn "Sin certificado SSL — configurando nginx en modo HTTP para obtenerlo..."
  sudo mkdir -p /var/www/certbot
  sudo tee "$NGINX_SITE" > /dev/null << NGINXHTTP
# Generado por deploy.sh (bootstrap) — $(date)
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 200 'bootstrapping';
        add_header Content-Type text/plain;
    }
}
NGINXHTTP

  if [[ ! -L "$NGINX_ENABLED" ]]; then
    sudo ln -sf "$NGINX_SITE" "$NGINX_ENABLED"
  fi

  sudo nginx -t 2>&1 && sudo systemctl reload nginx

  # ─── 5. Obtener certificado SSL por primera vez ────────────────────────────
  section "Obteniendo certificado SSL (primera vez)"
  command -v certbot &>/dev/null || error "certbot no está instalado. Instálalo con: sudo apt install certbot python3-certbot-nginx"
  sudo certbot certonly --webroot -w /var/www/certbot \
    -d "${DOMAIN}" -d "www.${DOMAIN}" \
    --cert-name "${DOMAIN}" \
    --non-interactive --agree-tos --email "admin@${DOMAIN}" \
    || error "certbot falló. Asegúrate de que el DNS de ${DOMAIN} apunte a este servidor."
  info "Certificado obtenido correctamente"
fi

# ─── Verificar certificado (con detección dinámica de path) ──────────────────
section "Verificando certificados SSL"

if ! sudo test -f "${CERT_PATH}/fullchain.pem"; then
  # certbot puede haber guardado el cert bajo otro nombre (ej. danielwar.tech-0001)
  FOUND=$(sudo find /etc/letsencrypt/live/ -name "fullchain.pem" 2>/dev/null \
    | grep -i "${DOMAIN}" | head -1 || true)
  if [[ -n "$FOUND" ]]; then
    CERT_PATH="$(dirname "$FOUND")"
    warn "Certificado encontrado en path alternativo: $CERT_PATH"
  else
    error "No se encontró certificado para $DOMAIN. Ejecuta: sudo certbot certificates"
  fi
fi

EXPIRY=$(sudo openssl x509 -enddate -noout -in "${CERT_PATH}/fullchain.pem" | cut -d= -f2)
info "Certificado válido hasta: $EXPIRY"

# ─── Escribir config nginx completa con SSL ───────────────────────────────────
section "Aplicando configuración nginx con SSL"

sudo tee "$NGINX_SITE" > /dev/null << NGINXCONF
# Generado por deploy.sh — $(date)
# Frontend: Next.js en Docker puerto ${FRONTEND_PORT}

server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name ${DOMAIN} www.${DOMAIN};

    ssl_certificate     ${CERT_PATH}/fullchain.pem;
    ssl_certificate_key ${CERT_PATH}/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;

    add_header X-Frame-Options           "SAMEORIGIN"  always;
    add_header X-Content-Type-Options    "nosniff"     always;
    add_header X-XSS-Protection          "1; mode=block" always;
    add_header Referrer-Policy           "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript
               text/xml application/xml image/svg+xml;
    gzip_min_length 1000;

    location /_next/static/ {
        proxy_pass http://127.0.0.1:${FRONTEND_PORT}/_next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location / {
        proxy_pass         http://127.0.0.1:${FRONTEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header   Upgrade           \$http_upgrade;
        proxy_set_header   Connection        "upgrade";
        proxy_set_header   Host              \$host;
        proxy_set_header   X-Real-IP         \$remote_addr;
        proxy_set_header   X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s;
    }
}
NGINXCONF

# Activar site si no está activado
if [[ ! -L "$NGINX_ENABLED" ]]; then
  sudo ln -sf "$NGINX_SITE" "$NGINX_ENABLED"
  info "Site habilitado en sites-enabled"
fi

# Test y reload
if sudo nginx -t 2>&1; then
  sudo systemctl reload nginx
  info "Nginx recargado correctamente"
else
  error "Nginx config inválida. Revisa $NGINX_SITE"
fi

# ─── 6. Build y despliegue Docker ─────────────────────────────────────────────
section "Desplegando contenedor Docker"

if [[ "$NO_BUILD" == false ]]; then
  info "Construyendo imagen (esto puede tardar unos minutos)..."
  docker compose build --no-cache
fi

info "Levantando contenedor..."
docker compose up -d --remove-orphans

# ─── 7. Health check ──────────────────────────────────────────────────────────
section "Verificando despliegue"

info "Esperando que Next.js arranque..."
MAX_WAIT=60
ELAPSED=0
until curl -sf "http://127.0.0.1:${FRONTEND_PORT}" -o /dev/null 2>&1; do
  if [[ $ELAPSED -ge $MAX_WAIT ]]; then
    warn "El servicio no respondió en ${MAX_WAIT}s. Revisa los logs:"
    docker compose logs --tail=30 frontend
    error "Health check fallido."
  fi
  sleep 2
  ELAPSED=$((ELAPSED + 2))
done
info "Servicio respondiendo en http://127.0.0.1:${FRONTEND_PORT}"

docker compose ps

# ─── 8. Limpieza ──────────────────────────────────────────────────────────────
docker image prune -f > /dev/null 2>&1 || true

# ─── 9. Cron de renovación SSL ────────────────────────────────────────────────
CRON_CMD="0 3 * * * certbot renew --quiet --deploy-hook 'systemctl reload nginx'"
( crontab -l 2>/dev/null | grep -v 'certbot renew' ; echo "$CRON_CMD" ) | crontab -
info "Cron de renovación SSL configurado"

# ─── Resumen ──────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║        Despliegue completado ✔           ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
echo ""
echo -e "  URL:        ${GREEN}https://${DOMAIN}${NC}"
echo -e "  Contenedor: $(docker compose ps --format '{{.Name}} ({{.Status}})' 2>/dev/null | head -1)"
echo -e "  Commit:     $(git rev-parse --short HEAD) — $(git log -1 --format='%s')"
echo ""
echo "  Comandos útiles:"
echo "    Logs en vivo:  docker compose logs -f frontend"
echo "    Reiniciar:     docker compose restart frontend"
echo "    Actualizar:    bash $APP_DIR/deploy.sh"
echo "    Solo restart:  bash $APP_DIR/deploy.sh --no-build"
echo ""

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
#   bash deploy.sh              → primer despliegue o actualización (build en VPS)
#   bash deploy.sh --no-build   → pull imagen pre-construida + reiniciar
#   bash deploy.sh --force-build → rebuild sin caché Docker (lento)
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
CERT_PATH="/var/lib/docker/volumes/portfolio_backend_certbot_certs/_data/live/${DOMAIN}"
NO_BUILD=false
FORCE_BUILD=false

# ─── Flags ────────────────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case $1 in
    --no-build)    NO_BUILD=true; shift ;;
    --force-build) FORCE_BUILD=true; shift ;;
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

# ─── 4. Verificar certificados SSL ──────────────────────────────────────────
section "Verificando certificados SSL"

# Los certificados están en el host y se montan como volumen en el contenedor nginx
if [[ ! -f "${CERT_PATH}/fullchain.pem" ]]; then
  warn "No se encontró certificado en ${CERT_PATH}"
  warn "Obtén el certificado primero:"
  warn "  sudo apt install certbot"
  warn "  sudo certbot certonly --standalone -d ${DOMAIN} -d www.${DOMAIN}"
  error "Certificado SSL requerido para continuar."
fi
EXPIRY=$(openssl x509 -enddate -noout -in "${CERT_PATH}/fullchain.pem" | cut -d= -f2)
info "Certificado válido hasta: $EXPIRY"

# ─── 6. Build y despliegue Docker ─────────────────────────────────────────────
section "Desplegando contenedor Docker"

if [[ "$NO_BUILD" == false ]]; then
  info "Construyendo imagen (esto puede tardar unos minutos)..."
  if [[ "$FORCE_BUILD" == true ]]; then
    warn "Modo --force-build: sin caché Docker"
    docker compose build --no-cache
  else
    docker compose build
  fi
else
  # Si no se buildea localmente, intentar pull por si se construyó desde otra máquina
  info "Intentando descargar imagen más reciente..."
  docker compose pull 2>/dev/null && info "Imagen descargada" || warn "No se pudo descargar (se usará la local)"
fi

info "Levantando contenedor..."
docker compose up -d --remove-orphans

# ─── 7. Health check ──────────────────────────────────────────────────────────
section "Verificando despliegue"

info "Esperando que los contenedores arranquen..."
MAX_WAIT=90
ELAPSED=0
# Health check al contenedor frontend directamente (sin pasar por nginx)
until docker compose exec -T frontend wget -qO- http://localhost:3000 &>/dev/null; do
  if [[ $ELAPSED -ge $MAX_WAIT ]]; then
    warn "El contenedor no respondió en ${MAX_WAIT}s. Revisa los logs:"
    docker compose logs --tail=30 frontend
    error "Health check fallido."
  fi
  sleep 3
  ELAPSED=$((ELAPSED + 3))
done
info "Contenedor frontend respondiendo"

docker compose ps

# ─── 8. Limpieza ──────────────────────────────────────────────────────────────
docker image prune -f > /dev/null 2>&1 || true

# ─── 9. Cron de renovación SSL ────────────────────────────────────────────────
# certbot renueva en el host; tras renovar, recarga el contenedor nginx
CRON_CMD="0 3 * * * certbot renew --quiet --deploy-hook 'docker compose -f ${APP_DIR}/docker-compose.yml restart nginx'"
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
echo "    Build en VPS:  bash $APP_DIR/deploy.sh"
echo "    Solo pull:     bash $APP_DIR/deploy.sh --no-build"
echo "    Sin caché:     bash $APP_DIR/deploy.sh --force-build"
echo "    Build local:   bash build-push.sh  (desde tu PC)"
echo ""

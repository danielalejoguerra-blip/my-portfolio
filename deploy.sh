#!/usr/bin/env bash
# deploy.sh — Despliega el frontend del portafolio en Ubuntu
# Uso: bash deploy.sh [--domain tudominio.com] [--repo git@github.com:user/repo.git]
set -euo pipefail

# ─── Colores ─────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()  { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }

# ─── Variables configurables ─────────────────────────────────────────────────
APP_DIR="${APP_DIR:-/opt/portfolio-frontend}"
REPO_URL="${REPO_URL:-}"          # e.g. git@github.com:user/my-portfolio.git
DOMAIN="${DOMAIN:-danielwar.tech}"
BRANCH="${BRANCH:-main}"

# Parsear flags
while [[ $# -gt 0 ]]; do
  case $1 in
    --domain) DOMAIN="$2";   shift 2 ;;
    --repo)   REPO_URL="$2"; shift 2 ;;
    --branch) BRANCH="$2";   shift 2 ;;
    *) error "Flag desconocido: $1" ;;
  esac
done

# ─── 1. Dependencias del sistema ─────────────────────────────────────────────
info "Verificando dependencias del sistema..."
sudo apt-get update -qq

if ! command -v docker &>/dev/null; then
  info "Instalando Docker..."
  sudo apt-get install -y ca-certificates curl gnupg
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
    | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
    https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
    | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  sudo apt-get update -qq
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
  sudo systemctl enable --now docker
  sudo usermod -aG docker "$USER"
  warn "Docker instalado. Si es la primera vez, cierra sesión y vuelve a entrar para que el grupo 'docker' surta efecto."
else
  info "Docker ya instalado: $(docker --version)"
fi

if ! docker compose version &>/dev/null; then
  error "docker compose plugin no encontrado. Instala docker-compose-plugin."
fi

# ─── 2. Directorio de la aplicación ──────────────────────────────────────────
if [[ -d "$APP_DIR/.git" ]]; then
  info "Repositorio ya existe. Haciendo pull en $APP_DIR..."
  git -C "$APP_DIR" fetch origin
  git -C "$APP_DIR" checkout "$BRANCH"
  git -C "$APP_DIR" pull origin "$BRANCH"
elif [[ -n "$REPO_URL" ]]; then
  info "Clonando repositorio en $APP_DIR..."
  sudo mkdir -p "$APP_DIR"
  sudo chown "$USER:$USER" "$APP_DIR"
  git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
else
  # Si se ejecuta desde el directorio del proyecto ya disponible
  APP_DIR="$(pwd)"
  info "Usando directorio actual: $APP_DIR"
fi

cd "$APP_DIR"

# ─── 3. Archivo .env de producción ───────────────────────────────────────────
if [[ ! -f "$APP_DIR/.env" ]]; then
  if [[ -f "$APP_DIR/.env.production.example" ]]; then
    cp "$APP_DIR/.env.production.example" "$APP_DIR/.env"
    warn "Se creó .env desde .env.production.example"
    warn "EDITA $APP_DIR/.env con los valores reales antes de continuar."
    warn "Luego vuelve a ejecutar: bash deploy.sh"
    exit 0
  else
    error "No existe .env ni .env.production.example en $APP_DIR"
  fi
fi

# ─── 4. Certificados SSL (Let's Encrypt con Certbot) ─────────────────────────
CERT_DIR="$APP_DIR/nginx/certs"
mkdir -p "$CERT_DIR"

if [[ -n "$DOMAIN" ]] && [[ ! -f "$CERT_DIR/fullchain.pem" ]]; then
  info "Obteniendo certificado SSL para $DOMAIN..."
  if ! command -v certbot &>/dev/null; then
    sudo apt-get install -y certbot
  fi
  sudo certbot certonly --standalone \
    --non-interactive --agree-tos --register-unsafely-without-email \
    -d "$DOMAIN" -d "www.$DOMAIN"
  sudo cp /etc/letsencrypt/live/"$DOMAIN"/fullchain.pem "$CERT_DIR/fullchain.pem"
  sudo cp /etc/letsencrypt/live/"$DOMAIN"/privkey.pem   "$CERT_DIR/privkey.pem"
  sudo chown "$USER:$USER" "$CERT_DIR"/*.pem
  info "Actualizando nginx.conf para el dominio $DOMAIN..."
    sed -i "s/danielwar.tech www.danielwar.tech/$DOMAIN www.$DOMAIN/g" "$APP_DIR/nginx/nginx.conf"
elif [[ ! -f "$CERT_DIR/fullchain.pem" ]]; then
  warn "No se encontraron certificados SSL en $CERT_DIR"
  warn "Para SSL en producción:"
  warn "  1. Obtén tus certs con: sudo certbot certonly --standalone -d tudominio.com"
  warn "  2. Cópialos a $CERT_DIR/fullchain.pem y $CERT_DIR/privkey.pem"
  warn "  3. Vuelve a ejecutar deploy.sh --domain tudominio.com"
  warn "Continuando sin SSL (sólo HTTP)..."
  # Reemplaza la config de nginx por una versión solo HTTP si no hay certs
  cat > "$APP_DIR/nginx/nginx.conf" <<'NGINX'
server {
    listen 80;
    server_name _;
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    location /_next/static/ {
        proxy_pass http://frontend:3000/_next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    location / {
        proxy_pass         http://frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade         $http_upgrade;
        proxy_set_header   Connection      "upgrade";
        proxy_set_header   Host            $host;
        proxy_set_header   X-Real-IP       $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
NGINX
fi

# ─── 5. Build y despliegue ────────────────────────────────────────────────────
info "Construyendo imagen Docker..."
docker compose build --no-cache

info "Levantando servicios..."
docker compose up -d --remove-orphans

info "Esperando que el servicio esté listo..."
sleep 5
docker compose ps

info "Limpiando imágenes antiguas..."
docker image prune -f

# ─── 6. Renovación automática de SSL ─────────────────────────────────────────
if [[ -n "$DOMAIN" ]]; then
  CRON_JOB="0 3 * * * certbot renew --quiet && cp /etc/letsencrypt/live/${DOMAIN}/fullchain.pem ${CERT_DIR}/fullchain.pem && cp /etc/letsencrypt/live/${DOMAIN}/privkey.pem ${CERT_DIR}/privkey.pem && docker compose -f ${APP_DIR}/docker-compose.yml restart nginx"
  ( crontab -l 2>/dev/null | grep -v 'certbot renew'; echo "$CRON_JOB" ) | crontab -
  info "Cron de renovación SSL configurado."
fi

echo ""
echo -e "${GREEN}✔ Despliegue completado.${NC}"
if [[ -n "$DOMAIN" ]]; then
  echo -e "  Frontend: ${GREEN}https://$DOMAIN${NC}"
else
  echo -e "  Frontend: ${GREEN}http://$(curl -s ifconfig.me 2>/dev/null || echo 'IP_DEL_SERVIDOR')${NC}"
fi
echo ""
echo "Comandos útiles:"
echo "  Ver logs:      docker compose -f $APP_DIR/docker-compose.yml logs -f"
echo "  Reiniciar:     docker compose -f $APP_DIR/docker-compose.yml restart"
echo "  Parar:         docker compose -f $APP_DIR/docker-compose.yml down"
echo "  Actualizar:    git -C $APP_DIR pull && bash $APP_DIR/deploy.sh"

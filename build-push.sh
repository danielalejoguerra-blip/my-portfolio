#!/usr/bin/env bash
# =============================================================================
# build-push.sh — Construir imagen Docker en tu máquina local y subirla
#
# Esto evita los ~17 min de build en el VPS. Tu PC local compila en ~2-4 min.
# Luego en el servidor solo ejecutas:  bash deploy.sh --no-build
#
# Requisitos:
#   - Docker instalado localmente
#   - docker login ya ejecutado (Docker Hub)
#   - Archivo .env con las variables NEXT_PUBLIC_*
#
# Uso:
#   bash build-push.sh                → build + push con tag :latest
#   bash build-push.sh v1.2.0         → build + push con tag :v1.2.0 y :latest
# =============================================================================
set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
info()    { echo -e "${GREEN}[✔]${NC} $*"; }
warn()    { echo -e "${YELLOW}[!]${NC} $*"; }
error()   { echo -e "${RED}[✘]${NC} $*" >&2; exit 1; }
section() { echo -e "\n${CYAN}══ $* ══${NC}"; }

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGE_NAME="danielwar01/portfolio-frontend"
TAG="${1:-latest}"

# Evita que Git Bash en Windows convierta rutas /foo → C:/Program Files/Git/foo
export MSYS_NO_PATHCONV=1
export MSYS2_ARG_CONV_EXCL="*"

cd "$APP_DIR"

# ─── Verificar prerequisitos ──────────────────────────────────────────────────
section "Verificando prerequisitos"
command -v docker &>/dev/null || error "Docker no está instalado."
[[ -f .env ]] || error "No existe .env. Copia .env.production.example y ajusta los valores."
info "Docker: $(docker --version)"

# ─── Cargar variables de .env ─────────────────────────────────────────────────
section "Cargando .env"
set -a
# shellcheck disable=SC1091
source .env
set +a
info "Variables cargadas"

# ─── Build ────────────────────────────────────────────────────────────────────
section "Construyendo imagen ${IMAGE_NAME}:${TAG}"

PLATFORM_FLAG=""
# Si estás en Mac ARM (M1/M2/M3), construir para amd64 (que es lo que usa el VPS)
if [[ "$(uname -m)" == "arm64" ]] || [[ "$(uname -m)" == "aarch64" ]]; then
  warn "Detectada arquitectura ARM → construyendo para linux/amd64 (tu VPS)"
  PLATFORM_FLAG="--platform linux/amd64"
fi

BUILD_START=$SECONDS
docker build $PLATFORM_FLAG \
  --build-arg NEXT_PUBLIC_BACKEND_URL="${NEXT_PUBLIC_BACKEND_URL:-}" \
  --build-arg NEXT_PUBLIC_ANALYTICS_SOCKET_URL="${NEXT_PUBLIC_ANALYTICS_SOCKET_URL:-}" \
  --build-arg NEXT_PUBLIC_ANALYTICS_SOCKET_PATH="${NEXT_PUBLIC_ANALYTICS_SOCKET_PATH:-}" \
  --build-arg NEXT_PUBLIC_ANALYTICS_NAMESPACE="${NEXT_PUBLIC_ANALYTICS_NAMESPACE:-}" \
  --build-arg NEXT_PUBLIC_ANALYTICS_ROOM="${NEXT_PUBLIC_ANALYTICS_ROOM:-}" \
  --build-arg NEXT_PUBLIC_ANALYTICS_REALTIME_DAYS="${NEXT_PUBLIC_ANALYTICS_REALTIME_DAYS:-}" \
  -t "${IMAGE_NAME}:${TAG}" \
  -t "${IMAGE_NAME}:latest" \
  -f Dockerfile .

BUILD_SECS=$((SECONDS - BUILD_START))
info "Imagen construida en ${BUILD_SECS}s"

# ─── Push ─────────────────────────────────────────────────────────────────────
section "Subiendo imagen a Docker Hub"

docker push "${IMAGE_NAME}:${TAG}"
if [[ "$TAG" != "latest" ]]; then
  docker push "${IMAGE_NAME}:latest"
fi

info "Imagen subida: ${IMAGE_NAME}:${TAG}"

# ─── Resumen ──────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          Imagen lista para desplegar ✔           ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  Imagen:  ${CYAN}${IMAGE_NAME}:${TAG}${NC}"
echo -e "  Build:   ${BUILD_SECS}s"
echo ""
echo "  Para desplegar en el VPS:"
echo "    ssh deploy@srv1540726 'cd /var/www/portfolio/my-portfolio && bash deploy.sh --no-build'"
echo ""

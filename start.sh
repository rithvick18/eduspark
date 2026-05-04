#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
#  EduSpark — unified start script
#  Usage: ./start.sh
#  Starts the FastAPI backend and the Vite frontend together.
#  Press Ctrl-C once to stop both processes.
# ─────────────────────────────────────────────────────────

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
VENV="$BACKEND_DIR/.venv/bin/activate"

# ── Colour helpers ──────────────────────────────────────
BOLD='\033[1m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
GREEN='\033[0;32m'
RED='\033[0;31m'
RESET='\033[0m'

log()     { echo -e "${BOLD}[EduSpark]${RESET} $*"; }
success() { echo -e "${GREEN}${BOLD}[EduSpark]${RESET} $*"; }
error()   { echo -e "${RED}${BOLD}[EduSpark] ERROR:${RESET} $*" >&2; }

# ── Pre-flight checks ───────────────────────────────────
if [ ! -f "$VENV" ]; then
  error "Python venv not found at $VENV"
  error "Run: cd backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt"
  exit 1
fi

if ! command -v node &>/dev/null; then
  error "Node.js is not installed. Please install Node.js 18+."
  exit 1
fi

if [ ! -d "$ROOT_DIR/node_modules" ]; then
  log "node_modules not found — running npm install..."
  npm install --silent
fi

# ── Cleanup on exit ─────────────────────────────────────
cleanup() {
  log "Shutting down both servers..."
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
  wait "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
  log "All processes stopped. Goodbye!"
}
trap cleanup INT TERM

# ── Start backend ───────────────────────────────────────
log "${MAGENTA}Starting FastAPI backend...${RESET}"
(
  # shellcheck source=/dev/null
  source "$VENV"
  cd "$BACKEND_DIR"
  while IFS= read -r line; do
    echo -e "${MAGENTA}${BOLD}[BACKEND]${RESET} $line"
  done < <(python main.py 2>&1)
) &
BACKEND_PID=$!

# Give the backend a moment to start before launching the frontend
sleep 2

# ── Start frontend ──────────────────────────────────────
log "${CYAN}Starting Vite frontend...${RESET}"
(
  cd "$ROOT_DIR"
  while IFS= read -r line; do
    echo -e "${CYAN}${BOLD}[FRONTEND]${RESET} $line"
  done < <(npm run dev 2>&1)
) &
FRONTEND_PID=$!

success "Both servers are running."
success "  Backend  → http://localhost:8000"
success "  Frontend → http://localhost:5173"
echo ""
log "Press ${BOLD}Ctrl-C${RESET} to stop everything."

# ── Wait ────────────────────────────────────────────────
wait "$BACKEND_PID" "$FRONTEND_PID"

#!/usr/bin/env bash

# Scriptmonks Localhost Helper
# Clean CLI to run the Next.js dev server or production build

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Defaults
PORT="${PORT:-3100}"
MODE="${MODE:-dev}"
LOG_DIR="/tmp/opencode"
LOG_FILE="$LOG_DIR/dev.log"
PID_FILE="$LOG_DIR/scriptmonks.pid"

# Ensure log dir exists
mkdir -p "$LOG_DIR"

banner() {
  echo -e "${BOLD}${CYAN}"
  echo "╔═══════════════════════════════════════════╗"
  echo "║           SCRIPTMONKS LOCALHOST           ║"
  echo "╚═══════════════════════════════════════════╝"
  echo -e "${NC}"
}

usage() {
  banner
  echo -e "${BOLD}Usage:${NC} ./localhost.sh [OPTIONS]"
  echo ""
  echo -e "${BOLD}Options:${NC}"
  echo -e "  ${GREEN}-d, --dev${NC}      Start dev server (Turbopack) [default]"
  echo -e "  ${GREEN}-s, --start${NC}    Start production server (requires build first)"
  echo -e "  ${GREEN}-b, --build${NC}    Build for production"
  echo -e "  ${GREEN}-k, --kill${NC}     Kill running server on port"
  echo -e "  ${GREEN}-st, --status${NC}  Check server status"
  echo -e "  ${GREEN}-l, --logs${NC}     Tail server logs"
  echo -e "  ${GREEN}-p, --port${NC}    Set port (default: 3100)"
  echo -e "  ${GREEN}-h, --help${NC}     Show this help"
  echo ""
  echo -e "${BOLD}Examples:${NC}"
  echo -e "  ${CYAN}./localhost.sh${NC}                # Start dev server on :3100"
  echo -e "  ${CYAN}./localhost.sh --port 3000${NC}    # Start dev server on :3000"
  echo -e "  ${CYAN}./localhost.sh --build${NC}       # Build production"
  echo -e "  ${CYAN}./localhost.sh --start${NC}      # Start production server"
  echo -e "  ${CYAN}./localhost.sh --kill${NC}       # Stop server"
  echo ""
}

check_deps() {
  if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}✗ pnpm not found${NC}"
    echo -e "${YELLOW}Install with: npm install -g pnpm${NC}"
    exit 1
  fi
  if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ node not found${NC}"
    exit 1
  fi
  echo -e "${GREEN}✓${NC} Dependencies OK (pnpm $(pnpm --version), node $(node --version))"
}

kill_server() {
  echo -e "${YELLOW}→${NC} Stopping server on port $PORT..."
  if command -v fuser &> /dev/null; then
    fuser -k ${PORT}/tcp 2>/dev/null || true
  fi
  pkill -f "next.*$PORT" 2>/dev/null || true
  pkill -f "next-server.*$PORT" 2>/dev/null || true
  sleep 2
  if lsof -i :$PORT 2>/dev/null | grep -q LISTEN; then
    echo -e "${RED}✗ Failed to kill process on port $PORT${NC}"
    exit 1
  else
    echo -e "${GREEN}✓${NC} Server stopped"
  fi
}

status() {
  banner
  echo -e "${BOLD}Status:${NC}"
  if lsof -i :$PORT 2>/dev/null | grep -q LISTEN; then
    echo -e "  ${GREEN}●${NC} Running on http://localhost:$PORT"
    echo -e "  ${CYAN}→${NC} $(curl -s http://localhost:$PORT 2>&1 | head -c 50)..."
  else
    echo -e "  ${RED}●${NC} Not running on port $PORT"
  fi
  echo ""
}

logs() {
  if [ -f "$LOG_FILE" ]; then
    echo -e "${BOLD}Tailing logs (Ctrl+C to exit):${NC}"
    tail -f "$LOG_FILE"
  else
    echo -e "${RED}✗ No logs found at $LOG_FILE${NC}"
  fi
}

start_dev() {
  banner
  check_deps
  echo -e "${BOLD}Mode:${NC} Development (Turbopack)"
  echo -e "${BOLD}Port:${NC} $PORT"
  echo -e "${BOLD}URL:${NC} ${CYAN}http://localhost:$PORT${NC}"
  echo ""
  
  # Check if already running
  if lsof -i :$PORT 2>/dev/null | grep -q LISTEN; then
    echo -e "${YELLOW}⚠${NC} Server already running on port $PORT"
    echo -e "  Use ${CYAN}./localhost.sh --kill${NC} to stop it first"
    exit 0
  fi
  
  echo -e "${YELLOW}→${NC} Starting dev server..."
  cd "$(dirname "$0")"
  
  setsid nohup pnpm dev --port $PORT > "$LOG_FILE" 2>&1 < /dev/null &
  echo $! > "$PID_FILE"
  
  echo -e "${YELLOW}→${NC} Waiting for server to start..."
  for i in {1..30}; do
    if curl -s --max-time 2 "http://localhost:$PORT" > /dev/null 2>&1; then
      echo ""
      echo -e "${GREEN}✓${NC} Server started successfully!"
      echo -e "${BOLD}→${NC} Open ${CYAN}http://localhost:$PORT${NC}"
      echo ""
      echo -e "${YELLOW}Tip:${NC} Run ${CYAN}./localhost.sh --logs${NC} to view logs"
      echo -e "${YELLOW}Tip:${NC} Run ${CYAN}./localhost.sh --kill${NC} to stop"
      exit 0
    fi
    sleep 1
    echo -n "."
  done
  echo ""
  echo -e "${RED}✗ Server failed to start within 30s${NC}"
  echo -e "${YELLOW}→${NC} Check logs: ${CYAN}./localhost.sh --logs${NC}"
  exit 1
}

build_prod() {
  banner
  check_deps
  echo -e "${BOLD}Mode:${NC} Production Build"
  echo ""
  echo -e "${YELLOW}→${NC} Building..."
  cd "$(dirname "$0")"
  pnpm build
  echo ""
  echo -e "${GREEN}✓${NC} Build complete!"
  echo -e "${YELLOW}Tip:${NC} Run ${CYAN}./localhost.sh --start${NC} to serve"
}

start_prod() {
  banner
  check_deps
  echo -e "${BOLD}Mode:${NC} Production Server"
  echo -e "${BOLD}Port:${NC} $PORT"
  echo -e "${BOLD}URL:${NC} ${CYAN}http://localhost:$PORT${NC}"
  echo ""
  
  if [ ! -d ".next" ]; then
    echo -e "${RED}✗ No build found${NC}"
    echo -e "${YELLOW}→${NC} Run ${CYAN}./localhost.sh --build${NC} first"
    exit 1
  fi
  
  if lsof -i :$PORT 2>/dev/null | grep -q LISTEN; then
    echo -e "${YELLOW}⚠${NC} Server already running on port $PORT"
    echo -e "  Use ${CYAN}./localhost.sh --kill${NC} to stop it first"
    exit 0
  fi
  
  echo -e "${YELLOW}→${NC} Starting production server..."
  cd "$(dirname "$0")"
  
  setsid nohup pnpm start --port $PORT > "$LOG_FILE" 2>&1 < /dev/null &
  echo $! > "$PID_FILE"
  
  echo -e "${YELLOW}→${NC} Waiting for server to start..."
  for i in {1..20}; do
    if curl -s --max-time 2 "http://localhost:$PORT" > /dev/null 2>&1; then
      echo ""
      echo -e "${GREEN}✓${NC} Production server started!"
      echo -e "${BOLD}→${NC} Open ${CYAN}http://localhost:$PORT${NC}"
      exit 0
    fi
    sleep 1
    echo -n "."
  done
  echo ""
  echo -e "${RED}✗ Server failed to start${NC}"
  echo -e "${YELLOW}→${NC} Check logs: ${CYAN}./localhost.sh --logs${NC}"
  exit 1
}

# Parse args
while [[ $# -gt 0 ]]; do
  case $1 in
    -d|--dev)
      MODE="dev"
      shift
      ;;
    -s|--start)
      MODE="start"
      shift
      ;;
    -b|--build)
      MODE="build"
      shift
      ;;
    -k|--kill)
      MODE="kill"
      shift
      ;;
    -st|--status)
      MODE="status"
      shift
      ;;
    -l|--logs)
      MODE="logs"
      shift
      ;;
    -p|--port)
      PORT="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      usage
      exit 1
      ;;
  esac
done

# Execute
case $MODE in
  dev)
    start_dev
    ;;
  start)
    start_prod
    ;;
  build)
    build_prod
    ;;
  kill)
    kill_server
    ;;
  status)
    status
    ;;
  logs)
    logs
    ;;
  *)
    usage
    exit 1
    ;;
esac

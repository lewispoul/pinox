#!/usr/bin/env bash
set -euo pipefail

APP="api.main:app"
HOST="127.0.0.1"
PORT="8000"
ROOT="$(pwd)"
LOG_DIR="${ROOT}/.logs"
RUN_DIR="${ROOT}/.run"
API_PID="${RUN_DIR}/api.pid"

mkdir -p "$LOG_DIR" "$RUN_DIR"

start_api() {
  if [ -f "$API_PID" ] && kill -0 "$(cat "$API_PID")" 2>/dev/null; then
    echo "API already running (PID $(cat "$API_PID"))"
    return
  fi
  echo "Starting API..."
  (PYTHONPATH="$ROOT" uvicorn "$APP" --host "$HOST" --port "$PORT" --reload \
    > "$LOG_DIR/api.log" 2>&1 & echo $! > "$API_PID")
  echo "API PID: $(cat "$API_PID")"
}

wait_ready() {
  echo -n "Waiting for API on $HOST:$PORT"
  for i in {1..60}; do
    if curl -fsS "http://$HOST:$PORT/docs" >/dev/null 2>&1; then
      echo " — ready."
      return
    fi
    echo -n "."
    sleep 0.5
  done
  echo
  echo "API did not become ready in time; see $LOG_DIR/api.log"
  exit 1
}

stop_api() {
  if [ -f "$API_PID" ]; then
    PID="$(cat "$API_PID")"
    if kill -0 "$PID" 2>/dev/null; then
      echo "Stopping API PID $PID"
      kill "$PID" || true
      rm -f "$API_PID"
    fi
  fi
}

usage() {
  echo "Usage: $0 \"<command to run while API is up>\""
  exit 1
}

main() {
  [ $# -ge 1 ] || usage
  trap 'stop_api' EXIT
  start_api
  wait_ready
  # run user command
  echo "Running: $*"
  PYTHONPATH="$ROOT" bash -lc "$*"
}

main "$@"

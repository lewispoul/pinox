#!/bin/bash
# Script pour démarrer le worker Dramatiq en arrière-plan
set -euo pipefail

LOG_FILE="nox_worker.log"

echo "Démarrage du worker Dramatiq en arrière-plan..."
echo "Logs: $LOG_FILE"

# Tuer les processus worker existants
pkill -f "dramatiq.*api.routes.jobs" 2>/dev/null || true

# Démarrer en arrière-plan
cd /home/lppoulin/nox-api-src
nohup bash -c "PYTHONPATH=. python -m dramatiq api.routes.jobs --processes 1 --threads 1" > "$LOG_FILE" 2>&1 &

WORKER_PID=$!
echo "Worker démarré avec PID: $WORKER_PID"
echo "$WORKER_PID" > nox_worker.pid

echo "✅ Worker Dramatiq démarré"
echo "Logs: tail -f $LOG_FILE"

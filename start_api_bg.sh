#!/bin/bash
# Script pour démarrer l'API Nox en arrière-plan
set -euo pipefail

API_PORT="${API_PORT:-8082}"
API_HOST="${API_HOST:-127.0.0.1}"
LOG_FILE="nox_api.log"

echo "Démarrage de l'API Nox en arrière-plan..."
echo "Port: $API_PORT"
echo "Host: $API_HOST" 
echo "Logs: $LOG_FILE"

# Tuer les processus existants
pkill -f "uvicorn.*api.main" 2>/dev/null || true

# Démarrer en arrière-plan avec nohup
cd /home/lppoulin/nox-api-src
nohup bash -c "PYTHONPATH=. python -m uvicorn api.main:app --host $API_HOST --port $API_PORT" > "$LOG_FILE" 2>&1 &

# Récupérer le PID
API_PID=$!
echo "API démarrée avec PID: $API_PID"
echo "$API_PID" > nox_api.pid

# Attendre que l'API soit prête
echo "Attente de la disponibilité de l'API..."
for i in {1..30}; do
    if curl -s "http://$API_HOST:$API_PORT/health" >/dev/null 2>&1; then
        echo "✅ API disponible sur http://$API_HOST:$API_PORT"
        exit 0
    fi
    sleep 1
done

echo "⚠️  Timeout: API peut ne pas être prête"
echo "Vérifiez les logs: tail -f $LOG_FILE"
exit 1

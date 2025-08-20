#!/bin/bash
# Script pour arrêter l'API Nox en arrière-plan
set -euo pipefail

echo "Arrêt de l'API Nox..."

# Utiliser le PID si disponible
if [ -f "nox_api.pid" ]; then
    PID=$(cat nox_api.pid)
    if kill -0 "$PID" 2>/dev/null; then
        echo "Arrêt du processus PID: $PID"
        kill "$PID"
        rm -f nox_api.pid
        echo "✅ API arrêtée"
    else
        echo "Le processus PID $PID n'existe plus"
        rm -f nox_api.pid
    fi
else
    echo "Fichier PID non trouvé, arrêt par nom de processus..."
    if pkill -f "uvicorn.*api.main"; then
        echo "✅ API arrêtée"
    else
        echo "Aucun processus API trouvé"
    fi
fi

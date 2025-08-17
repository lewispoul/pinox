#!/bin/bash
# Script pour arrêter le worker Dramatiq
set -euo pipefail

echo "Arrêt du worker Dramatiq..."

if [ -f "nox_worker.pid" ]; then
    PID=$(cat nox_worker.pid)
    if kill -0 "$PID" 2>/dev/null; then
        echo "Arrêt du processus PID: $PID"
        kill "$PID"
        rm -f nox_worker.pid
        echo "✅ Worker arrêté"
    else
        echo "Le processus PID $PID n'existe plus"
        rm -f nox_worker.pid
    fi
else
    echo "Fichier PID non trouvé, arrêt par nom de processus..."
    if pkill -f "dramatiq.*api.routes.jobs"; then
        echo "✅ Worker arrêté"
    else
        echo "Aucun processus worker trouvé"
    fi
fi

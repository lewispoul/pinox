#!/bin/bash
# Script maître pour gérer l'API et le worker Nox en arrière-plan
set -euo pipefail

COMMAND="${1:-help}"

case "$COMMAND" in
    start)
        echo "🚀 Démarrage de Nox (API + Worker)..."
        ./start_api_bg.sh
        sleep 2
        ./start_worker_bg.sh
        echo ""
        echo "✅ Nox démarré en arrière-plan"
        echo "API: http://127.0.0.1:8082"
        echo "Logs API: tail -f nox_api.log"
        echo "Logs Worker: tail -f nox_worker.log"
        ;;
    stop)
        echo "🛑 Arrêt de Nox (API + Worker)..."
        ./stop_api_bg.sh
        ./stop_worker_bg.sh
        echo "✅ Nox arrêté"
        ;;
    status)
        echo "📊 Status Nox:"
        if [ -f "nox_api.pid" ] && kill -0 "$(cat nox_api.pid)" 2>/dev/null; then
            echo "API: ✅ Running (PID: $(cat nox_api.pid))"
        else
            echo "API: ❌ Stopped"
        fi
        
        if [ -f "nox_worker.pid" ] && kill -0 "$(cat nox_worker.pid)" 2>/dev/null; then
            echo "Worker: ✅ Running (PID: $(cat nox_worker.pid))"
        else
            echo "Worker: ❌ Stopped"
        fi
        
        # Test API health
        if curl -s http://127.0.0.1:8082/health >/dev/null 2>&1; then
            echo "Health: ✅ API responds"
        else
            echo "Health: ❌ API not responding"
        fi
        ;;
    logs)
        echo "📝 Logs en temps réel (Ctrl+C pour arrêter):"
        tail -f nox_api.log nox_worker.log
        ;;
    check)
        echo "🔍 Test end-to-end:"
        ./check_nox.sh
        ;;
    help|*)
        echo "🛠️  Nox Background Manager"
        echo ""
        echo "Usage: $0 {start|stop|status|logs|check|help}"
        echo ""
        echo "Commands:"
        echo "  start   - Démarre API et Worker en arrière-plan"
        echo "  stop    - Arrête API et Worker"
        echo "  status  - Affiche le status des services"
        echo "  logs    - Affiche les logs en temps réel"
        echo "  check   - Lance le test end-to-end"
        echo "  help    - Affiche cette aide"
        echo ""
        echo "Files créés:"
        echo "  nox_api.pid    - PID de l'API"
        echo "  nox_worker.pid - PID du Worker"
        echo "  nox_api.log    - Logs de l'API"
        echo "  nox_worker.log - Logs du Worker"
        ;;
esac

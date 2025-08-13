#!/usr/bin/env bash
set -euo pipefail

echo "=== Test du Dashboard Streamlit pour Nox API ==="

# Configuration
STREAMLIT_PORT="${STREAMLIT_PORT:-8501}"
API_URL="${NOX_API_URL:-http://127.0.0.1:8081}"

echo "🚀 Lancement du dashboard Streamlit sur port $STREAMLIT_PORT"
echo "🔗 API Nox: $API_URL"

# Vérifier que l'API Nox fonctionne
echo "🔍 Test de connectivité API..."
if ! curl -fsS "$API_URL/health" >/dev/null; then
    echo "❌ API Nox non accessible sur $API_URL"
    echo "💡 Assurez-vous que l'API fonctionne avant de lancer le dashboard"
    exit 1
fi
echo "✅ API Nox accessible"

# Nettoyer les anciens processus Streamlit
echo "🧹 Nettoyage des anciens processus Streamlit..."
pkill -f "streamlit run" 2>/dev/null || true
sleep 2

# Lancer Streamlit en arrière-plan
echo "🚀 Lancement de Streamlit..."
cd "$(dirname "$0")/../dashboard"

nohup streamlit run app.py \
    --server.headless true \
    --server.port $STREAMLIT_PORT \
    --server.address 0.0.0.0 \
    > /tmp/nox_dashboard.log 2>&1 &

STREAMLIT_PID=$!
echo "📋 PID Streamlit: $STREAMLIT_PID"

# Attendre que Streamlit démarre
echo "⏳ Attente du démarrage (10s)..."
sleep 10

# Tester l'accès au dashboard
echo "🔍 Test d'accès au dashboard..."
if curl -fsS "http://127.0.0.1:$STREAMLIT_PORT" >/dev/null; then
    echo "✅ Dashboard accessible sur http://127.0.0.1:$STREAMLIT_PORT"
    echo "🎉 Test réussi!"
    echo ""
    echo "🌐 Ouvrez votre navigateur sur: http://127.0.0.1:$STREAMLIT_PORT"
    echo "⚙️  Variables d'environnement utiles:"
    echo "    - NOX_API_URL=$API_URL"
    echo "    - NOX_API_TOKEN=<votre-token>"
    echo ""
    echo "📊 Logs dashboard: tail -f /tmp/nox_dashboard.log"
else
    echo "❌ Dashboard non accessible"
    echo "📊 Logs pour diagnostic:"
    tail -20 /tmp/nox_dashboard.log
    exit 1
fi

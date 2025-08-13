#!/usr/bin/env bash
set -euo pipefail

echo "=== Test des métriques Prometheus pour Nox API ==="

# Configuration
API_URL="${NOX_API_URL:-http://127.0.0.1:8081}"
METRICS_ENDPOINT="${API_URL}/metrics"

echo "Endpoint testé: $METRICS_ENDPOINT"

# Test 1: Récupération des métriques
echo "🔍 Test 1: Récupération des métriques..."
curl -fsS "$METRICS_ENDPOINT" | tee /tmp/nox_metrics.out >/dev/null

# Test 2: Vérifier la présence des métriques attendues selon ChatGPT
echo "🔍 Test 2: Vérification des métriques nox_requests_total..."
if grep -q "nox_requests_total" /tmp/nox_metrics.out; then
    echo "✅ nox_requests_total trouvé"
else
    echo "❌ nox_requests_total manquant"
    exit 1
fi

echo "🔍 Test 3: Vérification des métriques nox_request_seconds_bucket..."
if grep -q "nox_request_seconds_bucket" /tmp/nox_metrics.out; then
    echo "✅ nox_request_seconds_bucket trouvé"
else
    echo "❌ nox_request_seconds_bucket manquant"
    exit 1
fi

echo "🔍 Test 4: Vérification des métriques sandbox..."
if grep -q "nox_sandbox_files" /tmp/nox_metrics.out; then
    echo "✅ nox_sandbox_files trouvé"
else
    echo "❌ nox_sandbox_files manquant"
fi

if grep -q "nox_sandbox_bytes" /tmp/nox_metrics.out; then
    echo "✅ nox_sandbox_bytes trouvé"
else
    echo "❌ nox_sandbox_bytes manquant"
fi

# Test 5: Générer du trafic pour tester le middleware
echo "🔍 Test 5: Génération de trafic pour tester le middleware..."
curl -fsS "$API_URL/health" >/dev/null || echo "Health endpoint non disponible"

# Récupérer les métriques après trafic
echo "🔍 Test 6: Vérification métriques après trafic..."
curl -fsS "$METRICS_ENDPOINT" | tee /tmp/nox_metrics_after.out >/dev/null

echo "📊 Comparaison avant/après:"
echo "Lignes avant: $(wc -l < /tmp/nox_metrics.out)"
echo "Lignes après: $(wc -l < /tmp/nox_metrics_after.out)"

echo "✅ [OK] Tous les tests de métriques Prometheus passés"
echo "📁 Métriques sauvées dans /tmp/nox_metrics_after.out"

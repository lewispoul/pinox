#!/usr/bin/env bash
# Suite de tests complète pour l'API Nox
set -euo pipefail

NOX_TOKEN="${1:-}"
BASE_URL="${2:-http://127.0.0.1:8080}"

if [[ -z "$NOX_TOKEN" ]]; then
    if [[ -f "/etc/default/nox-api" ]]; then
        NOX_TOKEN=$(sudo grep "^NOX_API_TOKEN=" /etc/default/nox-api | cut -d= -f2)
    fi
fi

if [[ -z "$NOX_TOKEN" ]]; then
    echo "Usage: $0 [TOKEN] [BASE_URL]"
    echo "Ou utiliser le token depuis /etc/default/nox-api"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== SUITE DE TESTS API NOX ==="
echo "Base URL: $BASE_URL"
echo "Token: ${NOX_TOKEN:0:8}..."
echo ""

TESTS_PASSED=0
TESTS_TOTAL=0

# Test 1: Health
echo "Test 1: Health check..."
((TESTS_TOTAL++))
if "$SCRIPT_DIR/curl_health.sh" "$NOX_TOKEN" "$BASE_URL" >/dev/null 2>&1; then
    echo "✓ Health check: PASSED"
    ((TESTS_PASSED++))
else
    echo "✗ Health check: FAILED"
fi

# Test 2: Put
echo "Test 2: File upload..."
((TESTS_TOTAL++))
if "$SCRIPT_DIR/curl_put.sh" "$NOX_TOKEN" "$BASE_URL" "test_suite.txt" >/dev/null 2>&1; then
    echo "✓ File upload: PASSED"
    ((TESTS_PASSED++))
else
    echo "✗ File upload: FAILED"
fi

# Test 3: Run Python
echo "Test 3: Python execution..."
((TESTS_TOTAL++))
if "$SCRIPT_DIR/curl_run_py.sh" "$NOX_TOKEN" "$BASE_URL" "import os; print(f'Python works! PID: {os.getpid()}')" >/dev/null 2>&1; then
    echo "✓ Python execution: PASSED"
    ((TESTS_PASSED++))
else
    echo "✗ Python execution: FAILED"
fi

# Test 4: Run Shell
echo "Test 4: Shell execution..."
((TESTS_TOTAL++))
if "$SCRIPT_DIR/curl_run_sh.sh" "$NOX_TOKEN" "$BASE_URL" "ls -la && pwd" >/dev/null 2>&1; then
    echo "✓ Shell execution: PASSED"
    ((TESTS_PASSED++))
else
    echo "✗ Shell execution: FAILED"
fi

echo ""
echo "=== RÉSULTATS ==="
echo "Tests réussis: $TESTS_PASSED/$TESTS_TOTAL"

if [[ $TESTS_PASSED -eq $TESTS_TOTAL ]]; then
    echo "✓ TOUS LES TESTS SONT PASSÉS"
    exit 0
else
    echo "✗ CERTAINS TESTS ONT ÉCHOUÉ"
    exit 1
fi

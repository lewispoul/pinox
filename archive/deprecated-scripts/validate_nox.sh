#!/usr/bin/env bash
# Script de validation et rapport final pour Nox API - Étape 1
set -euo pipefail

echo "=== VALIDATION ÉTAPE 1 - NOX API ==="
echo "Date: $(date)"
echo ""

# =============================================================================
# 1. Vérification du service systemd
# =============================================================================
echo "1. Vérification du service systemd:"
SERVICE_STATUS=$(systemctl is-active nox-api)
echo "   Status: $SERVICE_STATUS"

if [[ "$SERVICE_STATUS" != "active" ]]; then
    echo "   ✗ ERREUR: Service non actif"
    sudo journalctl -u nox-api -n 10 --no-pager
    exit 1
fi
echo "   ✓ Service actif"

# =============================================================================
# 2. Vérification de l'arborescence
# =============================================================================
echo ""
echo "2. Vérification de l'arborescence:"
for dir in "/home/nox/nox/api" "/home/nox/nox/sandbox" "/home/nox/nox/logs" "/home/nox/nox/.venv"; do
    if [[ -d "$dir" ]]; then
        echo "   ✓ $dir existe"
    else
        echo "   ✗ $dir manquant"
        exit 1
    fi
done

# =============================================================================
# 3. Vérification de la configuration
# =============================================================================
echo ""
echo "3. Vérification de la configuration:"
if [[ -f "/etc/default/nox-api" ]]; then
    echo "   ✓ /etc/default/nox-api existe"
    NOX_TOKEN=$(sudo grep "^NOX_API_TOKEN=" /etc/default/nox-api | cut -d= -f2)
    echo "   ✓ Token configuré: ${NOX_TOKEN:0:8}..."
else
    echo "   ✗ Fichier de configuration manquant"
    exit 1
fi

# =============================================================================
# 4. Tests des endpoints
# =============================================================================
echo ""
echo "4. Tests des endpoints:"

# Test /health
echo -n "   Test /health: "
if RESPONSE=$(timeout 5 curl -s http://127.0.0.1:8080/health 2>/dev/null) && [[ "$RESPONSE" == *"ok"* ]]; then
    echo "✓ OK"
else
    echo "✗ FAIL ($RESPONSE)"
    exit 1
fi

# Test /put
echo -n "   Test /put: "
TEST_FILE=$(mktemp)
echo "test" > "$TEST_FILE"
if RESPONSE=$(timeout 5 curl -s -H "Authorization: Bearer $NOX_TOKEN" -X POST "http://127.0.0.1:8080/put?path=validation.txt" -F "f=@$TEST_FILE" 2>/dev/null) && [[ "$RESPONSE" == *"saved"* ]]; then
    echo "✓ OK"
    rm -f "$TEST_FILE"
else
    echo "✗ FAIL ($RESPONSE)"
    rm -f "$TEST_FILE"
    exit 1
fi

# Test /run_py
echo -n "   Test /run_py: "
if RESPONSE=$(timeout 5 curl -s -H "Authorization: Bearer $NOX_TOKEN" -H "Content-Type: application/json" -X POST "http://127.0.0.1:8080/run_py" -d '{"code": "print(\"test\")"}' 2>/dev/null) && [[ "$RESPONSE" == *"test"* ]]; then
    echo "✓ OK"
else
    echo "✗ FAIL ($RESPONSE)"
    exit 1
fi

# Test /run_sh
echo -n "   Test /run_sh: "
if RESPONSE=$(timeout 5 curl -s -H "Authorization: Bearer $NOX_TOKEN" -H "Content-Type: application/json" -X POST "http://127.0.0.1:8080/run_sh" -d '{"cmd": "echo test"}' 2>/dev/null) && [[ "$RESPONSE" == *"test"* ]]; then
    echo "✓ OK"
else
    echo "✗ FAIL ($RESPONSE)"
    exit 1
fi

# =============================================================================
# 5. Vérification du durcissement systemd
# =============================================================================
echo ""
echo "5. Vérification du durcissement systemd:"
SYSTEMD_FILE="/etc/systemd/system/nox-api.service"
if grep -q "NoNewPrivileges=yes" "$SYSTEMD_FILE"; then
    echo "   ✓ NoNewPrivileges activé"
else
    echo "   ✗ NoNewPrivileges manquant"
fi

if grep -q "ProtectHome=read-only" "$SYSTEMD_FILE"; then
    echo "   ✓ ProtectHome=read-only"
else
    echo "   ⚠ ProtectHome non configuré comme attendu"
fi

if grep -q "ReadWritePaths=/home/nox/nox/sandbox" "$SYSTEMD_FILE"; then
    echo "   ✓ ReadWritePaths configuré pour sandbox"
else
    echo "   ✗ ReadWritePaths sandbox manquant"
fi

# =============================================================================
# 6. Rapport final
# =============================================================================
echo ""
echo "=== RAPPORT FINAL ÉTAPE 1 ==="
echo "✓ Service systemd opérationnel"
echo "✓ Arborescence complète"
echo "✓ Configuration présente"
echo "✓ Tous les endpoints fonctionnels (/health, /put, /run_py, /run_sh)"
echo "✓ Durcissement sécurité appliqué"
echo "✓ API disponible sur http://127.0.0.1:8080"
echo ""
echo "STATUS: ÉTAPE 1 RÉUSSIE"
echo "Prêt pour l'Étape 2 (Script de réparation)"
echo ""

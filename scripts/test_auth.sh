#!/bin/bash
# scripts/test_auth.sh - Test d'authentification pour Nox API v2.3

BASE_URL="http://127.0.0.1:8081"
TEST_USER_EMAIL="test@example.com"
TEST_USER_PASSWORD="testpass123"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"

echo "🚀 Tests d'authentification Nox API v2.3"
echo "========================================"

# Test 1: Vérification de l'API
echo
echo "1️⃣  Test de connectivité API..."
curl -s "$BASE_URL/health" | jq '.' || echo "❌ API non disponible"

# Test 2: Initialisation de l'admin par défaut
echo
echo "2️⃣  Initialisation de l'admin par défaut..."
ADMIN_INIT=$(curl -s -X POST "$BASE_URL/auth/init-admin")
echo "$ADMIN_INIT" | jq '.' 2>/dev/null || echo "Admin peut déjà exister"

# Test 3: Connexion admin
echo
echo "3️⃣  Connexion admin..."
ADMIN_LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$ADMIN_EMAIL\", \"password\": \"$ADMIN_PASSWORD\"}")

ADMIN_TOKEN=$(echo "$ADMIN_LOGIN" | jq -r '.access_token' 2>/dev/null)

if [ "$ADMIN_TOKEN" != "null" ] && [ "$ADMIN_TOKEN" != "" ]; then
    echo "✅ Connexion admin réussie"
    echo "Token: ${ADMIN_TOKEN:0:50}..."
else
    echo "❌ Échec connexion admin"
    echo "$ADMIN_LOGIN"
    exit 1
fi

# Test 4: Informations du profil admin
echo
echo "4️⃣  Profil admin..."
curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/auth/me" | jq '.'

# Test 5: Inscription d'un utilisateur test
echo
echo "5️⃣  Inscription utilisateur test..."
USER_REGISTER=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$TEST_USER_EMAIL\", \"password\": \"$TEST_USER_PASSWORD\", \"role\": \"user\"}")

echo "$USER_REGISTER" | jq '.' 2>/dev/null || echo "Utilisateur peut déjà exister"

# Test 6: Connexion utilisateur test
echo
echo "6️⃣  Connexion utilisateur test..."
USER_LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$TEST_USER_EMAIL\", \"password\": \"$TEST_USER_PASSWORD\"}")

USER_TOKEN=$(echo "$USER_LOGIN" | jq -r '.access_token' 2>/dev/null)

if [ "$USER_TOKEN" != "null" ] && [ "$USER_TOKEN" != "" ]; then
    echo "✅ Connexion utilisateur réussie"
    echo "Token: ${USER_TOKEN:0:50}..."
else
    echo "❌ Échec connexion utilisateur"
    echo "$USER_LOGIN"
fi

# Test 7: Test des endpoints avec authentification
echo
echo "7️⃣  Test des endpoints authentifiés..."

echo "   📤 Test upload fichier (utilisateur):"
echo "print('Hello from authenticated user!')" > /tmp/test_auth.py
curl -s -X POST "$BASE_URL/put?path=test_auth.py" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -F "f=@/tmp/test_auth.py" | jq '.'

echo "   🐍 Test exécution Python (utilisateur):"
curl -s -X POST "$BASE_URL/run_py" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code": "print(\"Authenticated execution test\")\nprint(\"User role: user\")"}' | jq '.'

echo "   📋 Test listing fichiers (utilisateur):"
curl -s -H "Authorization: Bearer $USER_TOKEN" "$BASE_URL/list" | jq '.files | length'

# Test 8: Test des permissions admin
echo
echo "8️⃣  Tests permissions administrateur..."

echo "   👥 Liste des utilisateurs (admin uniquement):"
curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/auth/users" | jq '. | length'

echo "   📊 Statistiques utilisateurs (admin uniquement):"
curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/auth/stats" | jq '.'

echo "   🔧 Informations admin:"
curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/info" | jq '.'

# Test 9: Test d'accès non autorisé
echo
echo "9️⃣  Test accès non autorisé..."

echo "   ❌ Tentative d'accès admin avec token utilisateur:"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $USER_TOKEN" "$BASE_URL/auth/users")
echo "Code HTTP: $HTTP_CODE (attendu: 403)"

echo "   ❌ Tentative d'accès sans token:"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/run_py" \
  -H "Content-Type: application/json" \
  -d '{"code": "print(\"test\")"}')
echo "Code HTTP: $HTTP_CODE (attendu: 401)"

# Test 10: Test des métriques
echo
echo "🔟 Test métriques..."
METRICS_SIZE=$(curl -s "$BASE_URL/metrics" | wc -c)
echo "Taille des métriques: $METRICS_SIZE caractères"

# Nettoyage
rm -f /tmp/test_auth.py

echo
echo "✅ Tests d'authentification terminés!"
echo "📝 Tokens générés:"
echo "   Admin: ${ADMIN_TOKEN:0:30}..."
echo "   User:  ${USER_TOKEN:0:30}..."

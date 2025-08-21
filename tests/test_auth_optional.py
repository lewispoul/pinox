import os
import pytest

@pytest.mark.anyio
async def test_bearer_auth_when_token_set(client, monkeypatch):
    # Si l’app exige un token quand NOX_API_TOKEN est défini :
    token = os.getenv("NOX_API_TOKEN", "").strip()
    if not token:
        pytest.skip("NOX_API_TOKEN non défini -> l’app fonctionne en mode ouvert, test d’auth non applicable")

    # Appelle un endpoint protégé (si /health est protégé chez toi, sinon /put)
    headers = {"Authorization": f"Bearer {token}"}
    r = await client.get("/health", headers=headers)
    assert r.status_code == 200

@pytest.mark.anyio
async def test_401_without_token_if_required(client, monkeypatch):
    token = os.getenv("NOX_API_TOKEN", "").strip()
    if not token:
        pytest.skip("NOX_API_TOKEN non défini -> l’app fonctionne en mode ouvert, test d’auth non applicable")

    # Sans Authorization -> devrait 401
    r = await client.get("/health")
    assert r.status_code in (401, 403)
import pytest

@pytest.mark.anyio
async def test_health(client):
    r = await client.get("/health")
    assert r.status_code == 200
    data = r.json()
    assert data.get("status") == "ok"
    assert "sandbox" in data  # selon ton implémentation

@pytest.mark.anyio
async def test_docs(client):
    # la page HTML doit répondre 200
    r = await client.get("/docs")
    assert r.status_code == 200
    assert "Swagger UI" in r.text or "swagger-ui" in r.text
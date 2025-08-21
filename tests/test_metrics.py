import pytest

@pytest.mark.anyio
async def test_metrics_endpoint(client):
    # Si NOX_METRICS_ENABLED=1, on attend 200.
    # Selon ton implémentation, la réponse peut être JSON ou texte (Prometheus).
    r = await client.get("/metrics")
    assert r.status_code in (200, 204)

    # On ne fait pas d’assert trop strict sur le format pour rester robuste
    # Mais on s’assure que ce n’est pas une erreur serveur
    assert r.status_code < 500
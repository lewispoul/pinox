import os
import tempfile
import shutil
import pathlib
import contextlib
import pytest
import anyio
from httpx import AsyncClient

# Important : forcer un sandbox éphémère par test-run
@pytest.fixture(scope="session")
def sandbox_dir(tmp_path_factory):
    d = tmp_path_factory.mktemp("nox_sandbox")
    return str(d)

@pytest.fixture(scope="session", autouse=True)
def test_env(sandbox_dir, monkeypatch):
    # Active les métriques si ton app les supporte
    monkeypatch.setenv("NOX_METRICS_ENABLED", "1")
    # Sandbox isolé
    monkeypatch.setenv("NOX_SANDBOX", sandbox_dir)
    # Timeout "safe"
    monkeypatch.setenv("NOX_TIMEOUT", "20")
    # Auth: si NOX_API_TOKEN est vide, l'app est ouverte (comportement actuel)
    # On ne met pas de token par défaut ici, les tests d'auth le gèrent.
    yield

@pytest.fixture(scope="session")
def app():
    # Importe l'ASGI app directement depuis le package corrigé
    # Chemin attendu par copilot : nox_api/api/nox_api.py -> app = FastAPI(...)
    from nox_api.api.nox_api import app as fastapi_app
    return fastapi_app

@pytest.fixture
async def client(app):
    # Client ASGI -> pas besoin de lancer uvicorn
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

# Petit helper pour créer un fichier dans le sandbox (côté tests si besoin)
@pytest.fixture
def sandbox_path(sandbox_dir):
    return pathlib.Path(sandbox_dir)
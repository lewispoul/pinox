# tests/conftest.py
import pathlib
import pytest
from httpx import AsyncClient

# One sandbox directory for the whole session
@pytest.fixture(scope="session")
def sandbox_dir(tmp_path_factory):
    d = tmp_path_factory.mktemp("nox_sandbox")
    return str(d)

# Apply env per test (function scope) to avoid scope mismatch with monkeypatch
@pytest.fixture(autouse=True)
def test_env(sandbox_dir, monkeypatch):
    monkeypatch.setenv("NOX_METRICS_ENABLED", "1")
    monkeypatch.setenv("NOX_SANDBOX", sandbox_dir)
    monkeypatch.setenv("NOX_TIMEOUT", "20")
    # NOTE: we don't set NOX_API_TOKEN here; auth tests control it explicitly.

# Import the FastAPI app once for the session
@pytest.fixture(scope="session")
def app():
    from nox_api.api.nox_api import app as fastapi_app
    return fastapi_app

# Async HTTP client for the app
@pytest.fixture
async def client(app):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

# Path helper for convenience
@pytest.fixture
def sandbox_path(sandbox_dir):
    return pathlib.Path(sandbox_dir)
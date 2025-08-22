# tests/conftest.py
import pathlib
import pytest
from httpx import AsyncClient, ASGITransport

# One sandbox directory for the whole test session
@pytest.fixture(scope="session")
def sandbox_dir(tmp_path_factory):
    d = tmp_path_factory.mktemp("nox_sandbox")
    return str(d)

# Per-test environment (function scope) so each test is isolated
@pytest.fixture(autouse=True)
def test_env(sandbox_dir, monkeypatch):
    # Enable metrics if your app supports them
    monkeypatch.setenv("NOX_METRICS_ENABLED", "1")
    # Point the app to a temp sandbox for this session
    monkeypatch.setenv("NOX_SANDBOX", str(sandbox_dir))
    # Keep a safe timeout
    monkeypatch.setenv("NOX_TIMEOUT", "20")
    # NOTE: Do NOT set NOX_API_TOKEN here; auth tests control it explicitly.
    # Ensure clean environment
    monkeypatch.delenv("NOX_API_TOKEN", raising=False)
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    monkeypatch.delenv("SMTP_HOST", raising=False)

# Import the FastAPI app once for the session
@pytest.fixture(scope="session")
def app():
    from nox_api.api.nox_api import app as fastapi_app
    return fastapi_app

# Async HTTP client bound to the ASGI app (httpx >= 0.28)
@pytest.fixture
async def client(app):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

# Convenience path helper
@pytest.fixture
def sandbox_path(sandbox_dir):
    return pathlib.Path(sandbox_dir)
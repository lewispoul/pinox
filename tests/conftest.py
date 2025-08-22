# tests/conftest.py
<<<<<<< HEAD
import os
import pytest
from _pytest.monkeypatch import MonkeyPatch

@pytest.fixture(scope="function")
def test_env(sandbox_dir):
    """
    Per-test environment setup. We use MonkeyPatch with function scope
    so pytest is happy and each test is isolated.
    """
    mp = MonkeyPatch()

    # sandbox dir made by another fixture
    mp.setenv("NOX_SANDBOX_ROOT", str(sandbox_dir))

    # Keep your real keys if they exist, otherwise use test defaults.
    mp.setenv("OPENAI_API_KEY", os.getenv("OPENAI_API_KEY", "sk-test"))
    mp.setenv("NOX_AUTH_TOKEN", os.getenv("NOX_AUTH_TOKEN", "changeme-super-secret"))
    # Add any other envs your app reads during tests:
    # mp.setenv("POSTGRES_PASSWORD", os.getenv("POSTGRES_PASSWORD", "postgres123"))
    # mp.setenv("JWT_SECRET", os.getenv("JWT_SECRET", "dev-secret"))

    yield
    mp.undo()
=======
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
>>>>>>> e4423fa58fca59d2037c22d162c01ed01b58237b

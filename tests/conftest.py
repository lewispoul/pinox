# tests/conftest.py
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

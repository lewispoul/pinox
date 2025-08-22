import pytest

@pytest.mark.anyio
async def test_run_py_timeout(client, monkeypatch):
    """Test run_py handles timeout properly"""
    monkeypatch.setenv("NOX_TIMEOUT", "2")  # 2 second timeout
    
    # Code that sleeps longer than timeout
    payload = {
        "code": "import time; time.sleep(5); print('done')",
        "filename": "slow_script.py"
    }
    
    r = await client.post("/run_py", json=payload)
    assert r.status_code == 408
    data = r.json()
    assert "Timeout" in data["detail"]


@pytest.mark.anyio
async def test_run_py_happy_path(client):
    """Test run_py executes Python code successfully"""
    payload = {
        "code": "print('Hello from Python'); result = 2 + 2; print(f'Result: {result}')",
        "filename": "test_script.py"
    }
    
    r = await client.post("/run_py", json=payload)
    assert r.status_code == 200
    data = r.json()
    
    assert "returncode" in data
    assert "stdout" in data
    assert "stderr" in data
    assert data["returncode"] == 0
    assert "Hello from Python" in data["stdout"]
    assert "Result: 4" in data["stdout"]


@pytest.mark.anyio
async def test_run_py_with_auth(client, monkeypatch):
    """Test run_py requires auth when token is set"""
    monkeypatch.setenv("NOX_API_TOKEN", "test-token-123")
    
    payload = {
        "code": "print('test')",
        "filename": "auth_test.py"
    }
    
    # Without auth
    r = await client.post("/run_py", json=payload)
    assert r.status_code == 401
    
    # With correct auth
    headers = {"Authorization": "Bearer test-token-123"}
    r = await client.post("/run_py", json=payload, headers=headers)
    assert r.status_code == 200


@pytest.mark.anyio
async def test_run_py_error_handling(client):
    """Test run_py handles Python errors properly"""
    payload = {
        "code": "print('before error'); raise ValueError('test error'); print('after error')",
        "filename": "error_script.py"
    }
    
    r = await client.post("/run_py", json=payload)
    assert r.status_code == 200
    data = r.json()
    
    assert data["returncode"] != 0  # Should have non-zero exit code
    assert "before error" in data["stdout"]
    assert "ValueError" in data["stderr"] or "ValueError" in data["stdout"]
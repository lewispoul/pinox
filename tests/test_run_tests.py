import pytest

@pytest.mark.anyio
async def test_run_tests_basic(client):
    """Test basic test runner functionality"""
    payload = {"test_path": "", "args": []}
    
    r = await client.post("/run_tests", json=payload)
    assert r.status_code == 200
    data = r.json()
    
    assert "ok" in data
    assert "returncode" in data
    assert "summary" in data
    assert "stdout" in data
    assert "stderr" in data


@pytest.mark.anyio
async def test_run_tests_with_auth(client, monkeypatch):
    """Test test runner requires auth when token is set"""
    monkeypatch.setenv("NOX_API_TOKEN", "test-token-123")
    
    payload = {"test_path": "", "args": []}
    
    # Without auth
    r = await client.post("/run_tests", json=payload)
    assert r.status_code == 401
    
    # With correct auth
    headers = {"Authorization": "Bearer test-token-123"}
    r = await client.post("/run_tests", json=payload, headers=headers)
    assert r.status_code == 200


@pytest.mark.anyio
async def test_run_tests_streaming_header(client):
    """Test test runner with streaming header returns SSE"""
    payload = {"test_path": "", "args": []}
    headers = {"Accept": "text/event-stream"}
    
    r = await client.post("/run_tests", json=payload, headers=headers)
    assert r.status_code == 200
    assert r.headers.get("content-type") == "text/event-stream; charset=utf-8"
    
    # Check that we get some SSE data
    content = r.text
    assert "data:" in content


@pytest.mark.anyio  
async def test_run_tests_timeout(client, monkeypatch):
    """Test test runner handles timeout"""
    # Set very short timeout
    monkeypatch.setenv("NOX_TIMEOUT", "1")
    
    payload = {
        "test_path": "", 
        "args": ["--tb=short"]  # This should be fast enough
    }
    
    r = await client.post("/run_tests", json=payload)
    # Should either succeed (if fast) or timeout
    assert r.status_code in [200, 408]
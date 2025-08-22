import pytest

@pytest.mark.anyio
async def test_gui_endpoint(client):
    """Test GUI endpoint serves HTML"""
    r = await client.get("/gui")
    assert r.status_code == 200
    assert r.headers["content-type"].startswith("text/html")
    
    content = r.text
    assert "<title>Pinox Agent GUI</title>" in content
    assert "Terminal" in content
    assert "Chat" in content
    assert "File Explorer" in content
    assert "Test Runner" in content
    assert "Request Builder" in content


@pytest.mark.anyio
async def test_gui_is_public(client, monkeypatch):
    """Test GUI endpoint is accessible without auth"""
    monkeypatch.setenv("NOX_API_TOKEN", "test-token-123")
    
    # GUI should be accessible without auth even when token is set
    r = await client.get("/gui")
    assert r.status_code == 200
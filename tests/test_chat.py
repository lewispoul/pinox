import pytest

@pytest.mark.anyio
async def test_chat_without_auth_when_no_token(client, monkeypatch):
    """Test chat endpoint works without auth when NOX_API_TOKEN is unset"""
    # Ensure no token is set
    monkeypatch.delenv("NOX_API_TOKEN", raising=False)
    
    payload = {
        "messages": [
            {"role": "user", "content": "Hello, how are you?"}
        ]
    }
    
    r = await client.post("/chat", json=payload)
    
    # Should fail with 501 when OpenAI key is not set
    assert r.status_code == 501
    data = r.json()
    assert "LLM not configured" in data["detail"]


@pytest.mark.anyio 
async def test_chat_with_auth_required(client, monkeypatch):
    """Test chat endpoint requires auth when NOX_API_TOKEN is set"""
    monkeypatch.setenv("NOX_API_TOKEN", "test-token-123")
    
    payload = {
        "messages": [
            {"role": "user", "content": "Hello"}
        ]
    }
    
    # Without auth header
    r = await client.post("/chat", json=payload)
    assert r.status_code == 401
    
    # With wrong auth
    headers = {"Authorization": "Bearer wrong-token"}
    r = await client.post("/chat", json=payload, headers=headers)
    assert r.status_code == 401
    
    # With correct auth but no OpenAI key
    headers = {"Authorization": "Bearer test-token-123"}
    r = await client.post("/chat", json=payload, headers=headers)
    assert r.status_code == 501


@pytest.mark.anyio
async def test_chat_with_openai_key_mock(client, monkeypatch):
    """Test chat returns mock response when OpenAI key is set"""
    monkeypatch.delenv("NOX_API_TOKEN", raising=False)  # No auth required
    monkeypatch.setenv("OPENAI_API_KEY", "mock-key-123")
    
    payload = {
        "messages": [
            {"role": "user", "content": "Test message"}
        ]
    }
    
    r = await client.post("/chat", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert "reply" in data
    assert "Test message" in data["reply"]  # Should echo the message in mock response
import pytest

@pytest.mark.anyio
async def test_mail_without_smtp_config(client):
    """Test mail endpoint returns 501 when SMTP not configured"""
    payload = {
        "to": "test@example.com",
        "subject": "Test Subject", 
        "body": "Test message body"
    }
    
    r = await client.post("/mail", json=payload)
    assert r.status_code == 501
    data = r.json()
    assert "SMTP not configured" in data["detail"]


@pytest.mark.anyio
async def test_mail_with_smtp_config_mock(client, monkeypatch):
    """Test mail endpoint returns mock response when SMTP is configured"""
    monkeypatch.setenv("SMTP_HOST", "localhost")
    monkeypatch.setenv("SMTP_PORT", "587")
    
    payload = {
        "to": "recipient@example.com",
        "subject": "Test Email",
        "body": "This is a test email body",
        "attachments": []
    }
    
    r = await client.post("/mail", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["sent"] is True
    assert "recipient@example.com" in data["message"]
    assert "Test Email" in data["message"]


@pytest.mark.anyio
async def test_mail_with_attachments(client, monkeypatch):
    """Test mail endpoint handles attachments in request"""
    monkeypatch.setenv("SMTP_HOST", "localhost")
    
    payload = {
        "to": "test@example.com",
        "subject": "Email with attachments",
        "body": "Please see attached files",
        "attachments": ["file1.txt", "docs/file2.pdf"]
    }
    
    r = await client.post("/mail", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["sent"] is True


@pytest.mark.anyio
async def test_mail_with_auth(client, monkeypatch):
    """Test mail endpoint requires auth when token is set"""
    monkeypatch.setenv("NOX_API_TOKEN", "test-token-123")
    monkeypatch.setenv("SMTP_HOST", "localhost")
    
    payload = {
        "to": "test@example.com",
        "subject": "Auth test",
        "body": "Testing authentication"
    }
    
    # Without auth
    r = await client.post("/mail", json=payload)
    assert r.status_code == 401
    
    # With correct auth
    headers = {"Authorization": "Bearer test-token-123"}
    r = await client.post("/mail", json=payload, headers=headers)
    assert r.status_code == 200
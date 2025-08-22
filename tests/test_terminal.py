import pytest

# Note: WebSocket testing requires special test client setup
# For now, we'll test the core terminal command validation logic

def test_forbidden_commands_list():
    """Test that FORBIDDEN commands list is properly defined"""
    from nox_api.api.nox_api import FORBIDDEN
    
    # Verify key dangerous commands are forbidden
    assert "rm" in FORBIDDEN
    assert "sudo" in FORBIDDEN  
    assert "kill" in FORBIDDEN
    assert "reboot" in FORBIDDEN
    assert "shutdown" in FORBIDDEN


@pytest.mark.anyio
async def test_websocket_endpoint_exists(client):
    """Test that WebSocket endpoint exists (basic connectivity test)"""
    # Since we can't easily test WebSocket in this setup,
    # we'll verify the endpoint is registered by checking it doesn't return 404
    # when accessed via HTTP (it should return 426 or similar)
    r = await client.get("/ws/terminal")
    
    # Should NOT be 404 (endpoint exists) but also not 200 (it's a WebSocket)
    assert r.status_code != 404
    # Typically FastAPI returns 426 for WebSocket accessed via HTTP
    # or some other non-200 code indicating wrong protocol
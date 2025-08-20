# Copilot-friendly commands

- **Start API (background)**: `make api-start`
- **Tail API logs**: `make api-logs`
- **Run tests**: `make test`
- **Stop API**: `make api-stop`
- **Run command with temporary API**: `scripts/dev.sh "pytest -k jobs_api -q"`

**Tip**: prefer tests using ASGITransport so you don't need a server.

## Example ASGITransport test

```py
from httpx import AsyncClient, ASGITransport
from api.main import app

@pytest.mark.asyncio
async def test_smoke():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        r = await c.get("/docs")
        assert r.status_code in (200, 404)
```

## Quick start

```bash
# No server needed (fastest)
make test

# Background API + tests
make api-start
make test
make api-stop

# One-off with temporary API
scripts/dev.sh "curl -s http://127.0.0.1:8000/docs | head"
```

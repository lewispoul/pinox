# Dev Workflow (one terminal, no collisions)

## Fastest pattern (tests without a server)
Prefer hitting the FastAPI app in-process:

```py
from httpx import AsyncClient, ASGITransport
from api.main import app

async def example():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        r = await c.get("/docs")
        assert r.status_code in (200, 404)
```

Run:
```bash
PYTHONPATH=$(pwd) pytest -q
```

## When you want a running API

Start it in the background (PID + log):
```bash
make api-start           # logs in .logs/api.log
make test                # run tests while API stays up
make api-logs            # watch the logs
make api-stop            # stop API
```

## One-off command with temporary API
```bash
scripts/dev.sh "pytest -k jobs_api -q"
```

## Troubleshooting

**Port in use**: `make api-stop`, then `make api-start`.

**Import errors**: ensure `PYTHONPATH=$(pwd)` when running tests.

**Secrets**: don't echo keys; use env vars (`export OPENAI_API_KEY=...`).

## Redis + Worker Mode (optional)

When `REDIS_URL` is set, jobs run in Dramatiq workers:

```bash
# Terminal 1: Start Redis (if not running)
redis-server --daemonize yes

# Terminal 2: Start API with Redis
export REDIS_URL=redis://localhost:6379/0
make api-start

# Terminal 3: Start worker  
export REDIS_URL=redis://localhost:6379/0
export PYTHONPATH=$(pwd)
dramatiq workers.jobs_worker --processes 1 --threads 1
```

Without `REDIS_URL`, jobs run in local threads (great for testing).

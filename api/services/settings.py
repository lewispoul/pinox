from pydantic import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    redis_url: str = "redis://127.0.0.1:6379/0"
    artifacts_root: Path = Path("./artifacts").resolve()
    xtb_bin: str = "xtb"
    sse_heartbeat_sec: int = 15

    class Config:
        env_file = ".env"

settings = Settings()
settings.artifacts_root.mkdir(parents=True, exist_ok=True)

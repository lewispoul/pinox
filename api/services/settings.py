from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    
    redis_url: str = "redis://127.0.0.1:6379/0"
    artifacts_root: Path = Path("./artifacts").resolve()
    xtb_bin: str = "xtb"
    sse_heartbeat_sec: int = 15

settings = Settings()
settings.artifacts_root.mkdir(parents=True, exist_ok=True)

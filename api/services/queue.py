import dramatiq
import os

try:
    from dramatiq.brokers.redis import RedisBroker
    from .settings import settings
    REDIS_URL = getattr(settings, 'redis_url', os.getenv("REDIS_URL", "redis://localhost:6379/0"))
    broker = RedisBroker(url=REDIS_URL)
except Exception:
    from dramatiq.brokers.stub import StubBroker
    broker = StubBroker()

dramatiq.set_broker(broker)

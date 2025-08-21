"""
Health check schemas
"""
try:
    from pydantic import BaseModel
except ImportError:
    # Stub BaseModel when Pydantic is not available
    class BaseModel:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)


class HealthResponse(BaseModel):
    """Health check response model."""
    status: str
    timestamp: str
    service: str
    version: str
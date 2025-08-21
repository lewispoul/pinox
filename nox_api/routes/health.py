"""
Health check endpoints
"""
from datetime import datetime
from fastapi import APIRouter
from ..schemas.health import HealthResponse

router = APIRouter()





@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Basic health check endpoint."""
    return HealthResponse(
        status="ok",
        timestamp=datetime.utcnow().isoformat(),
        service="Nox API",
        version="2.2.0"
    )


@router.get("/")
async def root():
    """API root endpoint."""
    return {
        "service": "Nox API",
        "version": "2.2.0",
        "description": "Secure code execution API with observability and policy enforcement",
        "timestamp": datetime.utcnow().isoformat(),
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }
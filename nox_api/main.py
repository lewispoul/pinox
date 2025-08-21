"""
Main FastAPI application for Nox API
Clean, restructured version with proper imports and middleware.
"""
import os
import pathlib

try:
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    
    from .middleware.metrics import MetricsMiddleware
    from .middleware.rate_limit import RateLimitMiddleware
    from .routes import files, health
    
    FASTAPI_AVAILABLE = True
except ImportError:
    # FastAPI not available, create a stub
    FASTAPI_AVAILABLE = False
    FastAPI = None
    CORSMiddleware = None
    MetricsMiddleware = None
    RateLimitMiddleware = None
    files = None
    health = None

# Configuration
NOX_TOKEN = os.getenv("NOX_API_TOKEN", "").strip()
SANDBOX = pathlib.Path(os.getenv("NOX_SANDBOX", "/tmp/nox_sandbox")).resolve()
TIMEOUT_SEC = int(os.getenv("NOX_TIMEOUT", "20"))

# Ensure sandbox directory exists
try:
    SANDBOX.mkdir(parents=True, exist_ok=True)
except PermissionError:
    import tempfile
    SANDBOX = pathlib.Path(tempfile.mkdtemp(prefix="nox_sandbox_"))
    print(f"Warning: Using temporary sandbox at {SANDBOX}")
except Exception as e:
    print(f"Warning: Could not create sandbox: {e}")
    SANDBOX = pathlib.Path("/tmp")

# FastAPI app instance
if FASTAPI_AVAILABLE:
    app = FastAPI(
        title="Nox API",
        description="Secure code execution API with observability and policy enforcement",
        version="2.2.0",
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Configure appropriately in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Custom middleware
    app.add_middleware(MetricsMiddleware)
    app.add_middleware(RateLimitMiddleware)

    # Include routers
    if files and health:
        app.include_router(health.router, prefix="/api", tags=["health"])
        app.include_router(files.router, prefix="/api", tags=["files"])
else:
    # Create a stub app when FastAPI is not available
    class StubApp:
        def __init__(self):
            self.title = "Nox API"
            self.version = "2.2.0"
            self.description = "Secure code execution API with observability and policy enforcement"
    
    app = StubApp()
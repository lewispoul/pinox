"""
Middleware package for Nox API
"""

try:
    from .metrics import MetricsMiddleware
    from .rate_limit import RateLimitMiddleware
    __all__ = ["MetricsMiddleware", "RateLimitMiddleware"]
except ImportError:
    # FastAPI/Starlette not available
    __all__ = []
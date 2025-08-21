"""
Rate limiting and policy middleware for nox-api
No-op implementation that just passes through calls.
"""
from starlette.middleware.base import BaseHTTPMiddleware


class RateLimitAndPolicyMiddleware(BaseHTTPMiddleware):
    """No-op middleware for Rate Limiting and Policy enforcement."""

    async def dispatch(self, request, call_next):
        """Main middleware entry point - no-op implementation."""
        return await call_next(request)
"""
Middleware module for nox-api
Minimal HTTP middleware that just passes through calls.
"""
import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


class MetricsMiddleware(BaseHTTPMiddleware):
    """Minimal middleware that just passes through calls."""
    
    async def dispatch(self, request: Request, call_next):
        rid = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        request.state.request_id = rid
        
        response: Response = await call_next(request)
        
        response.headers["X-Request-ID"] = rid
        return response
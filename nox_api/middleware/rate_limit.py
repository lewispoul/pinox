"""
Rate limiting and policy enforcement middleware
"""
import time
from collections import defaultdict

try:
    from starlette.middleware.base import BaseHTTPMiddleware
    from starlette.requests import Request
    from starlette.responses import Response
    from fastapi import HTTPException
    DEPENDENCIES_AVAILABLE = True
except ImportError:
    DEPENDENCIES_AVAILABLE = False
    BaseHTTPMiddleware = object
    Request = None
    Response = None
    HTTPException = None


if DEPENDENCIES_AVAILABLE:
    class RateLimitMiddleware(BaseHTTPMiddleware):
        """Middleware for rate limiting and policy enforcement."""
        
        def __init__(self, app, requests_per_minute: int = 60, **kwargs):
            super().__init__(app)
            self.requests_per_minute = requests_per_minute
            self.requests = defaultdict(list)  # IP -> list of timestamps
        
        def _clean_old_requests(self, ip: str) -> None:
            """Remove requests older than 1 minute for given IP."""
            now = time.time()
            cutoff = now - 60  # 60 seconds ago
            self.requests[ip] = [timestamp for timestamp in self.requests[ip] if timestamp > cutoff]
        
        def _get_client_ip(self, request: Request) -> str:
            """Extract client IP address from request."""
            # Check for forwarded headers first
            forwarded_for = request.headers.get("X-Forwarded-For")
            if forwarded_for:
                return forwarded_for.split(",")[0].strip()
            
            real_ip = request.headers.get("X-Real-IP")
            if real_ip:
                return real_ip
            
            # Fallback to client host
            if hasattr(request, "client") and request.client:
                return request.client.host
            
            return "unknown"
        
        async def dispatch(self, request: Request, call_next):
            """Process request with rate limiting."""
            client_ip = self._get_client_ip(request)
            now = time.time()
            
            # Clean old requests for this IP
            self._clean_old_requests(client_ip)
            
            # Check rate limit
            current_requests = len(self.requests[client_ip])
            if current_requests >= self.requests_per_minute:
                raise HTTPException(
                    status_code=429, 
                    detail="Too many requests. Please try again later.",
                    headers={"Retry-After": "60"}
                )
            
            # Record this request
            self.requests[client_ip].append(now)
            
            # Process request
            response: Response = await call_next(request)
            
            # Add rate limiting headers
            response.headers["X-RateLimit-Limit"] = str(self.requests_per_minute)
            response.headers["X-RateLimit-Remaining"] = str(
                self.requests_per_minute - len(self.requests[client_ip])
            )
            
            return response
else:
    # Stub class when dependencies are not available
    class RateLimitMiddleware:
        """Stub rate limit middleware when dependencies are not available."""
        def __init__(self, app, **kwargs):
            pass
"""
Metrics middleware for request tracking and performance monitoring
"""
import time
import uuid

try:
    from starlette.middleware.base import BaseHTTPMiddleware
    from starlette.requests import Request
    from starlette.responses import Response
    STARLETTE_AVAILABLE = True
except ImportError:
    STARLETTE_AVAILABLE = False
    BaseHTTPMiddleware = object
    Request = None
    Response = None


if STARLETTE_AVAILABLE:
    class MetricsMiddleware(BaseHTTPMiddleware):
        """Middleware for collecting performance metrics."""
        
        def __init__(self, app, **kwargs):
            super().__init__(app)
            # Initialize metrics collectors here
            self.request_count = 0
            self.response_times = []
        
        async def dispatch(self, request: Request, call_next):
            """Process request and collect metrics."""
            # Generate request ID
            request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
            request.state.request_id = request_id
            
            # Record start time
            start_time = time.perf_counter()
            
            # Process request
            response: Response = await call_next(request)
            
            # Calculate response time
            duration = time.perf_counter() - start_time
            
            # Collect metrics
            self.request_count += 1
            self.response_times.append(duration)
            
            # Add headers
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Response-Time"] = f"{duration:.3f}s"
            
            return response
else:
    # Stub class when Starlette is not available
    class MetricsMiddleware:
        """Stub metrics middleware when Starlette is not available."""
        def __init__(self, app, **kwargs):
            pass
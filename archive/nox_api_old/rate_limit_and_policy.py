"""
Rate limiting and policy middleware for nox-api
Simplified version with optional functionality controlled by environment variables.
"""
import os
import time
import json
from collections import defaultdict, deque
from typing import Dict, Any
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware


class RateLimitAndPolicyMiddleware(BaseHTTPMiddleware):
    """Middleware for Rate Limiting and Policy enforcement."""

    def __init__(self, app):
        super().__init__(app)
        self.enabled = os.getenv("NOX_RATE_LIMIT_ENABLED", "0") == "1"
        
        if self.enabled:
            # In-memory counters (use Redis in production)
            self.ip_counters = defaultdict(lambda: deque())
            self.token_counters = defaultdict(lambda: deque())
            self.rate_limit_window = 60  # seconds
            self.max_requests_per_window = 60  # requests per minute
        
    async def dispatch(self, request: Request, call_next):
        """Main middleware entry point."""
        if not self.enabled:
            # If rate limiting is disabled, just pass through
            return await call_next(request)
            
        # Rate limiting logic
        client_ip = request.client.host if request.client else "unknown"
        
        # Check rate limit
        current_time = time.time()
        if not self._check_rate_limit(client_ip, current_time):
            return Response(
                content=json.dumps({"error": "Rate limit exceeded"}),
                status_code=429,
                headers={"Retry-After": "60", "Content-Type": "application/json"},
            )
        
        # Process request
        return await call_next(request)
    
    def _check_rate_limit(self, client_ip: str, current_time: float) -> bool:
        """Check if request is within rate limits."""
        if not self.enabled:
            return True
            
        # Clean old requests outside the window
        cutoff_time = current_time - self.rate_limit_window
        counter = self.ip_counters[client_ip]
        
        while counter and counter[0] < cutoff_time:
            counter.popleft()
        
        # Check if we're under the limit
        if len(counter) >= self.max_requests_per_window:
            return False
        
        # Add current request
        counter.append(current_time)
        return True
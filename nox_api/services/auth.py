"""
Authentication service
"""
import os
from typing import Optional

try:
    from fastapi import HTTPException
    FASTAPI_AVAILABLE = True
except ImportError:
    FASTAPI_AVAILABLE = False
    
    # Stub HTTPException when FastAPI is not available
    class HTTPException(Exception):
        def __init__(self, status_code, detail):
            self.status_code = status_code
            self.detail = detail
            super().__init__(detail)


class AuthService:
    """Service for handling authentication and authorization."""
    
    def __init__(self):
        self.token = os.getenv("NOX_API_TOKEN", "").strip()
    
    def check_auth(self, auth_header: Optional[str]) -> None:
        """Check authorization header and raise HTTPException if invalid."""
        if not self.token:
            return  # No token configured, allow all requests
            
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Unauthorized")
            
        token = auth_header.removeprefix("Bearer ").strip()
        if token != self.token:
            raise HTTPException(status_code=401, detail="Unauthorized")
    
    def extract_user_id(self, auth_header: Optional[str]) -> Optional[str]:
        """Extract user ID from auth header - stub implementation."""
        # TODO: Implement proper JWT token decoding
        if auth_header and auth_header.startswith("Bearer "):
            return "anonymous"  # Placeholder
        return None
    
    def is_authenticated(self, auth_header: Optional[str]) -> bool:
        """Check if request is authenticated."""
        try:
            self.check_auth(auth_header)
            return True
        except HTTPException:
            return False
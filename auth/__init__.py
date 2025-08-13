"""
Module d'authentification pour l'API Nox
"""
from .models import User, UserRole, Database, db
from .schemas import UserCreate, UserLogin, UserOut, Token, TokenData, UserUpdate, UserStats
from .utils import AuthUtils, RoleChecker
from .dependencies import get_current_user, require_role, require_admin, optional_auth
from .routes import router as auth_router

__all__ = [
    # Models
    "User",
    "UserRole", 
    "Database",
    "db",
    
    # Schemas
    "UserCreate",
    "UserLogin",
    "UserOut",
    "Token",
    "TokenData",
    "UserUpdate",
    "UserStats",
    
    # Utils
    "AuthUtils",
    "RoleChecker",
    
    # Dependencies
    "get_current_user",
    "require_role",
    "require_admin",
    "optional_auth",
    
    # Router
    "auth_router"
]

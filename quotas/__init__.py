"""
Quota management system for Nox API

This module provides:
- User quota models and enforcement
- PostgreSQL database operations  
- Prometheus metrics collection
- FastAPI middleware and routes
- Admin and user endpoints
"""

from .models import UserQuota, UserUsage, QuotaViolation, QuotaCheckResult, QuotaType
from .database import QuotaDatabase
from .middleware import QuotaEnforcementMiddleware
from .metrics import quota_metrics, get_quota_metrics_output
from .routes import admin_router, user_router, initialize_quota_system, cleanup_quota_system
from .migrations import run_migrations

__all__ = [
    # Models
    'UserQuota',
    'UserUsage', 
    'QuotaViolation',
    'QuotaCheckResult',
    'QuotaType',
    
    # Database
    'QuotaDatabase',
    
    # Middleware 
    'QuotaEnforcementMiddleware',
    
    # Metrics
    'quota_metrics',
    'get_quota_metrics_output',
    
    # Routes
    'admin_router',
    'user_router',
    'initialize_quota_system',
    'cleanup_quota_system',
    
    # Migrations
    'run_migrations'
]

__version__ = '1.0.0'

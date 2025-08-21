"""
Safe local module for metrics_chatgpt
Provides stub implementations for metrics functionality.
"""


def metrics_response(*args, **kwargs):
    """Stub function that returns safe default metrics response."""
    return "text/plain", "# Metrics disabled or not available\n"


def update_sandbox_metrics(*args, **kwargs):
    """Stub function for updating sandbox metrics - no-op."""
    return None
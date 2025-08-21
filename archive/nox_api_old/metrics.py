"""
Metrics module for nox-api
Prometheus metrics collection and sandbox monitoring.
"""
import os
import pathlib
from prometheus_client import (
    Counter,
    Histogram,
    Gauge,
    generate_latest,
    CONTENT_TYPE_LATEST,
    CollectorRegistry,
)

# Use a custom registry to avoid duplicates
registry = CollectorRegistry()

# Only create metrics if enabled
NOX_METRICS_ENABLED = os.getenv("NOX_METRICS_ENABLED", "1") == "1"

if NOX_METRICS_ENABLED:
    REQS = Counter(
        "nox_requests_total",
        "Total des requêtes",
        ["endpoint", "method", "code"],
        registry=registry,
    )
    LAT = Histogram(
        "nox_request_seconds",
        "Durée des requêtes en secondes",
        ["endpoint", "method", "code"],
        buckets=(0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10),
        registry=registry,
    )
    SANDBOX_FILES = Gauge(
        "nox_sandbox_files", "Nombre de fichiers dans le sandbox", registry=registry
    )
    SANDBOX_BYTES = Gauge(
        "nox_sandbox_bytes", "Taille totale sandbox en octets", registry=registry
    )
else:
    # No-op metrics when disabled
    class NoOpMetric:
        def labels(self, *args, **kwargs):
            return self
        def inc(self, *args, **kwargs):
            pass
        def observe(self, *args, **kwargs):
            pass
        def set(self, *args, **kwargs):
            pass
    
    REQS = NoOpMetric()
    LAT = NoOpMetric()
    SANDBOX_FILES = NoOpMetric()
    SANDBOX_BYTES = NoOpMetric()


def update_sandbox_metrics(root: str) -> None:
    """Update sandbox metrics if metrics are enabled."""
    if not NOX_METRICS_ENABLED:
        return
        
    p = pathlib.Path(root)
    files = 0
    size = 0
    if p.exists():
        for f in p.rglob("*"):
            try:
                if f.is_file():
                    files += 1
                    size += f.stat().st_size
            except Exception:
                pass
    SANDBOX_FILES.set(files)
    SANDBOX_BYTES.set(size)


def metrics_response():
    """Get metrics response for Prometheus scraping."""
    if not NOX_METRICS_ENABLED:
        return "text/plain", "# Metrics disabled"
    return CONTENT_TYPE_LATEST, generate_latest(registry)
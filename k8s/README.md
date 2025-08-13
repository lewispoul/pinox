# Kubernetes Manifests for Nox API v7.0.0

This directory contains Kubernetes deployment manifests for production orchestration of Nox API v7.0.0.

## Files

- `namespace.yaml` - Dedicated namespace for Nox API
- `configmap.yaml` - Configuration management
- `secrets.yaml` - Secure credential storage  
- `postgres.yaml` - PostgreSQL database deployment
- `redis.yaml` - Redis cache deployment
- `nox-api.yaml` - Main API application deployment
- `services.yaml` - Service definitions and load balancing
- `ingress.yaml` - External access and SSL termination
- `monitoring.yaml` - Prometheus and Grafana monitoring

## Deployment

```bash
# Apply all manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get all -n nox-api

# View logs
kubectl logs -n nox-api -l app=nox-api
```

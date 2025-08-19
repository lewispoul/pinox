# 📱 NOX API v8.0.0 — Ops Quick Command Card

**🚨 EMERGENCY ROLLBACK:** 

```bash
kubectl patch ingress nox-api-ingress -n nox-production -p '{"spec":{"rules":[{"http":{"paths":[{"backend":{"service":{"name":"nox-api-service-blue","port":{"number":80}}}}]}}]}}'

```

---


## 🔥 **CRITICAL COMMANDS**


### **Health Checks**

```bash

# Staging health
curl -f https://staging-api.yourdomain.com/health


# Production health  
curl -f https://api.yourdomain.com/health


# Version check
curl https://api.yourdomain.com/version

```


### **Validation**

```bash

# Full staging validation (15 min)
docs/deployment-guides/PRODUCTION_CREDENTIALS_GUIDE.md


# Quick performance test (5 min)
LOAD_TEST_DURATION=5m ./scripts/validate_staging.sh


# Environment dependencies
./scripts/verify_env.py

```


### **Deployment**

```bash

# Deploy to staging
kubectl apply -f k8s/staging/ -n nox-staging-green


# Deploy to production green
kubectl apply -f k8s/production/green/ -n nox-production-green


# Wait for ready
kubectl wait --for=condition=ready pod -l app=nox-api -n nox-production-green --timeout=300s

```


### **Traffic Switch**

```bash

# Switch to Green (new version)
kubectl patch ingress nox-api-ingress -n nox-production \
  -p '{"spec":{"rules":[{"http":{"paths":[{"backend":{"service":{"name":"nox-api-service-green","port":{"number":80}}}}]}}]}}'


# Switch to Blue (rollback)
kubectl patch ingress nox-api-ingress -n nox-production \
  -p '{"spec":{"rules":[{"http":{"paths":[{"backend":{"service":{"name":"nox-api-service-blue","port":{"number":80}}}}]}}]}}'

```


### **Monitoring**

```bash

# Watch pods
kubectl get pods -n nox-production-green -w


# Pod logs (follow)
kubectl logs -f deployment/nox-api-deployment-green -n nox-production-green


# Resource usage
kubectl top pods -n nox-production-green


# HPA status
kubectl get hpa -n nox-production-green

```

---


## 📊 **SUCCESS TARGETS**


| Check | Command | Expected |

|-------|---------|----------|

| Health | `curl api.domain.com/health` | `200 OK` |

| Version | `curl api.domain.com/version` | `"8.0.0"` |

| Response Time | Load test p95 | `< 300ms` |

| Error Rate | Load test | `< 5%` |

| Pods Ready | `kubectl get pods` | All `Running` |

---


## 🚨 **TROUBLESHOOTING**


| Issue | Quick Fix |

|-------|-----------|

| Pod won't start | `kubectl describe pod <name>` |

| Health check fails | `kubectl logs <pod>` |  

| High error rate | Check logs + rollback |

| DB connection | Verify secrets + migration |

| OAuth failures | Check provider credentials |

---


## 📞 **EMERGENCY CONTACTS**

- **DevOps Lead:** [Phone]
- **Database Admin:** [Phone] 
- **Product Owner:** [Phone]
- **Slack:** #ops-alerts

---

**⏱️ Deployment Timeline:**

1. Pre-flight (5m) → 2. Staging (15m) → 3. Prep (10m) → 4. Deploy (15m) → 5. Monitor (48h)

**🎯 One Command Validation:** `./scripts/validate_staging.sh`

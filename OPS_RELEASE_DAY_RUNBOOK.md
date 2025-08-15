# 🚀 NOX API v8.0.0 — Ops Release Day Runbook

**Release Version:** v8.0.0  
**Release Date:** August 15, 2025  
**On-Call Engineer:** [Your Name]  
**Estimated Duration:** 45-60 minutes  

**🚨 Emergency Contacts:**
- DevOps Lead: [Phone] / [Slack]
- Product Owner: [Phone] / [Slack]
- Database Admin: [Phone] / [Slack]

---


## 📋 **QUICK CHECKLIST OVERVIEW**


```

[ ] Pre-Flight Checks (5 min)
[ ] Staging Validation (15 min)
[ ] Production Prep (10 min)
[ ] Release Execution (15 min)
[ ] Post-Deployment (Ongoing)
[ ] Rollback Ready (48h window)

```

---


## 1. 🔍 **PRE-FLIGHT CHECKS** *(5 minutes)*


### **Code Sync**

```bash
cd /home/lppoulin/nox-api-src
git checkout main && git pull origin main
git status  # Ensure clean working directory

```


### **Environment Dependencies**

```bash

# Verify scientific computing stack
./scripts/verify_env.py


# Expected: All dependencies PASS (RDKit, Psi4, Cantera, XTB)

```


### **Secrets Verification**

```bash

# Check Kubernetes secrets in staging
kubectl get secrets -n nox-staging-green
kubectl get secret nox-api-secrets -n nox-staging-green -o yaml | grep -E "(GOOGLE|GITHUB|MICROSOFT)_CLIENT"


# Check production secrets
kubectl get secrets -n nox-production

```


### **Environment Parity Check**

- [ ] Same Node.js version (20.x) in staging and production

- [ ] Same PostgreSQL version (15.x)  

- [ ] Same Redis version (7.x)

- [ ] Same container base images

---


## 2. ✅ **STAGING VALIDATION** *(15 minutes)*


### **Deploy to Staging**

```bash

# Deploy v8.0.0 to Blue-Green staging
kubectl apply -f k8s/staging/ -n nox-staging-green


# Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app=nox-api -n nox-staging-green --timeout=300s

```


### **Automated Validation**

```bash

# Run complete validation suite
export BASE_URL="https://staging-api.yourdomain.com"
export NAMESPACE="nox-staging-green"

./scripts/validate_staging.sh


# MUST SEE: "VALIDATION PASSED - Ready for production deployment!"

```


### **Critical Test Points**

```bash

# Health check
curl -f https://staging-api.yourdomain.com/health

# Expected: {"status": "healthy"}


# Version verification  
curl https://staging-api.yourdomain.com/version

# Expected: {"version": "8.0.0"}


# OAuth URL generation
curl https://staging-api.yourdomain.com/api/auth/google/url
curl https://staging-api.yourdomain.com/api/auth/github/url
curl https://staging-api.yourdomain.com/api/auth/microsoft/url

# Expected: Valid authorization URLs

```


### **Performance Verification**

```bash

# Quick load test (5 minutes)
SKIP_LOAD_TEST=false LOAD_TEST_DURATION=5m ./scripts/validate_staging.sh


# Or full load test
BASE_URL=https://staging-api.yourdomain.com k6 run scripts/load-test.js


# MUST ACHIEVE:

# - 95% requests < 300ms

# - Error rate < 5%

# - No 5xx errors under sustained load

```

---


## 3. 🛠️ **PRODUCTION PREP** *(10 minutes)*


### **Team Communication**

```bash

# Announce in ops channel

# "🚀 Starting NOX API v8.0.0 production deployment"

# "Monitoring dashboards: [Grafana URL]"

# "Expected completion: [TIME]"

```


### **Database Migration**

```bash

# Backup production database
kubectl exec -it postgres-pod -n nox-production -- pg_dump nox_production > backup_pre_v8.0.0_$(date +%Y%m%d_%H%M%S).sql


# Apply migration
kubectl exec -it postgres-pod -n nox-production -- psql nox_production -f /migrations/v8_to_v8.0.0.sql


# Verify migration
kubectl exec -it postgres-pod -n nox-production -- psql nox_production -c "SELECT config_value FROM system_configuration WHERE config_key = 'database_schema_version';"

# Expected: "8.0.0"

```


### **Rollback Preparation**

```bash

# Prepare rollback manifests
kubectl get all -n nox-production -o yaml > rollback_manifests_$(date +%Y%m%d_%H%M%S).yaml


# Verify old namespace is still running
kubectl get pods -n nox-production-blue  # Current production (Green → Blue naming)

```

---


## 4. 🚀 **RELEASE EXECUTION** *(15 minutes)*


### **Release Tagging**

```bash

# Tag and push release
git tag -a v8.0.0 -m "NOX API v8.0.0 Production Release"
git push origin v8.0.0


# Verify tag
git show v8.0.0

```


### **Container Images**

```bash

# Build and push production images
docker build -t nox-api:v8.0.0 .
docker tag nox-api:v8.0.0 your-registry.com/nox-api:v8.0.0
docker push your-registry.com/nox-api:v8.0.0


# Verify image
docker scan nox-api:v8.0.0  # Should show no critical vulnerabilities

```


### **Blue-Green Deployment**

```bash

# Deploy to Green environment (new v8.0.0)
kubectl apply -f k8s/production/green/ -n nox-production-green


# Wait for all pods ready
kubectl wait --for=condition=ready pod -l app=nox-api -n nox-production-green --timeout=300s


# Check pod status
kubectl get pods -n nox-production-green

```


### **Smoke Test on Green**

```bash

# Test internal service (before traffic switch)
kubectl port-forward svc/nox-api-service-green 8080:80 -n nox-production-green &
PORT_FORWARD_PID=$!


# Health check on Green
curl -f http://localhost:8080/health
curl http://localhost:8080/version  # Should return 8.0.0


# Kill port-forward
kill $PORT_FORWARD_PID

```


### **Traffic Switch**

```bash

# Switch ingress traffic from Blue → Green
kubectl patch ingress nox-api-ingress -n nox-production \
  -p '{"spec":{"rules":[{"http":{"paths":[{"backend":{"service":{"name":"nox-api-service-green","port":{"number":80}}}}]}}]}}'


# Verify traffic switch
curl -f https://api.yourdomain.com/health
curl https://api.yourdomain.com/version  # Should return 8.0.0

```

---


## 5. 📊 **POST-DEPLOYMENT MONITORING** *(Ongoing)*


### **Immediate Verification** *(First 10 minutes)*

```bash

# Production health checks
curl -f https://api.yourdomain.com/health
curl -f https://api.yourdomain.com/version
curl -f https://api.yourdomain.com/ready


# Test OAuth flows
curl https://api.yourdomain.com/api/auth/google/url
curl https://api.yourdomain.com/api/auth/github/url
curl https://api.yourdomain.com/api/auth/microsoft/url

```


### **Application Logs Monitoring**

```bash

# Monitor production pods
kubectl logs -f deployment/nox-api-deployment-green -n nox-production-green --tail=100


# Watch for errors
kubectl logs -f deployment/nox-api-deployment-green -n nox-production-green | grep -i error


# Check pod status
watch -n 30 'kubectl get pods -n nox-production-green'

```


### **Performance Monitoring** *(First 30 minutes)*
- **Grafana Dashboard:** Monitor response times, error rates, CPU, memory
- **Prometheus Alerts:** Watch for threshold breaches
- **Sentry:** Check for new exceptions or error spikes
- **Database:** Monitor connection pools and query performance


### **Key Metrics to Watch**

| Metric | Target | Critical Threshold |

|--------|--------|--------------------|

| Response Time (p95) | < 300ms | < 500ms |

| Error Rate | < 1% | < 5% |

| Memory Usage | < 70% | < 90% |

| CPU Usage | < 50% | < 80% |

| Active Pods | ≥ 3 | ≥ 2 |

---


## 6. 🔄 **48-HOUR MONITORING WINDOW**


### **Extended Monitoring**

- [ ] **Hour 1:** Intensive monitoring, all metrics stable

- [ ] **Hour 6:** Verify user traffic patterns normal

- [ ] **Hour 24:** Check overnight stability and batch jobs

- [ ] **Hour 48:** Final validation before cleanup


### **Success Criteria for 48h**

- [ ] No critical alerts triggered

- [ ] Response times within SLA (< 300ms p95)

- [ ] Error rate < 1%

- [ ] No user-reported issues

- [ ] All scientific computation jobs completing successfully

---


## 🚨 **ROLLBACK PROCEDURE** *(Emergency Use Only)*


### **Immediate Rollback** *(< 5 minutes)*

```bash

# 1. Switch traffic back to Blue (old version)
kubectl patch ingress nox-api-ingress -n nox-production \
  -p '{"spec":{"rules":[{"http":{"paths":[{"backend":{"service":{"name":"nox-api-service-blue","port":{"number":80}}}}]}}]}}'


# 2. Verify rollback
curl https://api.yourdomain.com/version  # Should return previous version


# 3. Scale down Green pods (optional)
kubectl scale deployment nox-api-deployment-green --replicas=0 -n nox-production-green

```


### **Database Rollback** *(If migration issues)*

```bash

# Restore database from backup
kubectl exec -it postgres-pod -n nox-production -- pg_restore -d nox_production backup_pre_v8.0.0_TIMESTAMP.sql

```


### **Communication**

```bash

# Alert team immediately

# Post in ops channel: "🚨 NOX API v8.0.0 ROLLBACK initiated - investigating issues"

# Create incident ticket

# Notify stakeholders

```

---


## 📞 **EMERGENCY CONTACTS**

**Primary On-Call:** [Your Name] - [Phone] - [Slack: @handle]  
**DevOps Lead:** [Name] - [Phone] - [Slack: @handle]  
**Database Admin:** [Name] - [Phone] - [Slack: @handle]  
**Product Owner:** [Name] - [Phone] - [Slack: @handle]

**Slack Channels:**
- **#ops-alerts** - Immediate alerts and incidents
- **#nox-releases** - Release coordination  
- **#dev-team** - Development team communication

---


## 🔗 **REFERENCE LINKS**

- **Full Checklist:** `STAGING_VALIDATION_RELEASE_CHECKLIST.md`
- **Monitoring Dashboards:** [Grafana URL]
- **Error Tracking:** [Sentry URL]  
- **Logs:** [ELK Stack URL]
- **Runbooks:** [Wiki URL]

---


## ✅ **COMPLETION CHECKLIST**


### **Pre-Production**

- [ ] All pre-flight checks completed

- [ ] Staging validation passed (automated script success)

- [ ] Performance benchmarks met (95% < 300ms, <5% errors)

- [ ] Database migration applied and verified

- [ ] Team notified and monitoring active


### **Production Deploy**

- [ ] Release tagged and pushed (v8.0.0)

- [ ] Docker images built and scanned

- [ ] Blue-Green deployment completed

- [ ] Traffic switched successfully

- [ ] Smoke tests passed on production


### **Post-Deploy**

- [ ] All health checks passing

- [ ] Performance metrics within targets

- [ ] No errors in application logs

- [ ] Monitoring dashboards show green

- [ ] 48-hour monitoring window initiated

---

**🎉 NOX API v8.0.0 Production Deployment Complete!**

**Release Engineer:** _________________ **Time:** _________  
**Status:** [ ] Success [ ] Rolled Back [ ] Partial Issues  
**Next Review:** _________________ (48h from deployment)

---

*One-command validation: `./scripts/validate_staging.sh`*  
*Emergency rollback: Switch ingress + alert team immediately*

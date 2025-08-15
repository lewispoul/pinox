# 🚀 NOX API v8.0.0 Release Team Quick Reference

## 📋 **RELEASE CHECKLIST OVERVIEW**

### **Quick Status Check**
```bash
# Run full validation
./scripts/validate_staging.sh

# Quick health check
curl https://staging-api.yourdomain.com/health
curl https://staging-api.yourdomain.com/version
```

### **Environment Setup**
```bash
export BASE_URL="https://staging-api.yourdomain.com"
export NAMESPACE="nox-staging-green" 
export DATABASE_URL="postgresql://..."
export REDIS_URL="redis://..."
export TEST_TOKEN="your-test-jwt-token"
export ADMIN_TOKEN="your-admin-jwt-token"
```

---

## 🔧 **CRITICAL COMMANDS**

### **1. Pre-Deployment Verification**
```bash
# Environment dependencies check
python3 scripts/verify_env.py

# Kubernetes cluster access
kubectl cluster-info
kubectl get nodes
```

### **2. Deployment Commands**
```bash
# Deploy to staging green environment
kubectl apply -f k8s/staging/ -n nox-staging-green

# Check deployment status
kubectl get pods -n nox-staging-green -w
kubectl logs -f deployment/nox-api-deployment-green -n nox-staging-green

# Database migration
psql $DATABASE_URL < migrations/v8_to_v8.0.0.sql
```

### **3. Testing Commands**
```bash
# API smoke tests
curl -f $BASE_URL/health
curl $BASE_URL/version | jq '.version'

# OAuth flow tests
curl $BASE_URL/api/auth/google/url
curl $BASE_URL/api/auth/github/url
curl $BASE_URL/api/auth/microsoft/url

# Load testing (5 minute abbreviated test)
LOAD_TEST_DURATION=5m ./scripts/validate_staging.sh

# Full load test
BASE_URL=$BASE_URL k6 run scripts/load-test.js
```

### **4. Monitoring Commands**
```bash
# Check HPA status
kubectl get hpa -n nox-staging-green
kubectl describe hpa nox-api-hpa-green -n nox-staging-green

# View metrics
curl $BASE_URL/metrics | head -20

# Check pod resources
kubectl top pods -n nox-staging-green
```

---

## 🚨 **TROUBLESHOOTING COMMANDS**

### **Pod Issues**
```bash
# Get pod status and events
kubectl get pods -n nox-staging-green -o wide
kubectl describe pod <pod-name> -n nox-staging-green
kubectl logs <pod-name> -n nox-staging-green --previous

# Debug pod connectivity
kubectl exec -it <pod-name> -n nox-staging-green -- /bin/sh
```

### **Service Issues**
```bash
# Check service endpoints
kubectl get endpoints -n nox-staging-green
kubectl describe service nox-api-service-green -n nox-staging-green

# Test internal service connectivity
kubectl run debug --image=busybox -n nox-staging-green -it --rm -- wget -qO- http://nox-api-service-green/health
```

### **Database Issues**
```bash
# Test database connectivity
psql $DATABASE_URL -c "SELECT version();"

# Check migration status
psql $DATABASE_URL -c "SELECT * FROM migration_log ORDER BY timestamp DESC LIMIT 5;"

# Check table creation
psql $DATABASE_URL -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%v8%';"
```

### **Performance Issues**
```bash
# Check resource usage
kubectl top pods -n nox-staging-green
kubectl get hpa -n nox-staging-green

# View recent logs for errors
kubectl logs -f deployment/nox-api-deployment-green -n nox-staging-green --tail=100 | grep -i error

# Check application metrics
curl -s $BASE_URL/metrics | grep -E "(http_|memory_|cpu_)"
```

---

## 📊 **SUCCESS CRITERIA**

### **✅ MUST PASS (Critical)**
- [ ] Health endpoint returns 200 OK
- [ ] Version endpoint returns "8.0.0"  
- [ ] All OAuth providers generate valid URLs
- [ ] Database migration completed successfully
- [ ] All pods running and ready
- [ ] HPA functional and scaling properly

### **⚠️ SHOULD PASS (Important)**
- [ ] Load test: 95% requests < 300ms
- [ ] Error rate < 5% under load
- [ ] All security headers present
- [ ] SSL/TLS working correctly
- [ ] Monitoring and alerting active

### **ℹ️ MAY PASS (Optional)**
- [ ] Scientific computation endpoints responding
- [ ] WebSocket connections working
- [ ] Admin endpoints accessible (with proper RBAC)
- [ ] Metrics endpoint available

---

## 🎯 **PERFORMANCE TARGETS**

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| Response Time (p95) | < 300ms | < 500ms |
| Error Rate | < 1% | < 5% |
| Availability | > 99.9% | > 99% |
| Memory Usage | < 70% | < 90% |
| CPU Usage | < 50% | < 80% |
| Pod Startup Time | < 30s | < 60s |

---

## 📞 **EMERGENCY PROCEDURES**

### **Rollback Commands**
```bash
# Immediate traffic rollback (Blue-Green)
kubectl patch ingress nox-api-ingress -n nox-production \
  -p '{"spec":{"rules":[{"http":{"paths":[{"backend":{"service":{"name":"nox-api-blue"}}}]}}]}}'

# Database rollback
pg_restore -d nox_production backup_pre_v8.0.0_$(date +%Y%m%d).sql

# Alert team
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"🚨 NOX API v8.0.0 rollback initiated"}' \
  $SLACK_WEBHOOK_URL
```

### **Common Issues & Solutions**

| Issue | Symptoms | Solution |
|-------|----------|----------|
| Pod CrashLoop | Pods restarting frequently | Check logs: `kubectl logs <pod> --previous` |
| High Memory | OOMKilled in events | Scale up resources or optimize code |
| DB Connection | "connection refused" errors | Check DATABASE_URL and network policies |
| SSL Issues | Certificate warnings | Verify cert-manager and TLS secrets |
| OAuth Failures | Authentication redirects fail | Check OAuth provider settings and secrets |

---

## 📋 **FINAL GO/NO-GO CHECKLIST**

### **Technical Sign-off**
- [ ] All critical tests passed (>90% success rate)
- [ ] Performance benchmarks met
- [ ] Security scans clean (no high/critical vulnerabilities)  
- [ ] Database migration verified
- [ ] Monitoring and alerting active
- [ ] Rollback procedures tested

### **Business Sign-off**  
- [ ] Stakeholder approval received
- [ ] Support team notified and trained
- [ ] Documentation updated
- [ ] Release notes published
- [ ] Communication plan executed

### **Operational Readiness**
- [ ] On-call rotation scheduled
- [ ] Monitoring dashboards configured
- [ ] Incident response playbooks updated
- [ ] Capacity planning reviewed

---

## 🎉 **PRODUCTION RELEASE**

### **Release Commands**
```bash
# Tag release
git tag -a v8.0.0 -m "NOX API v8.0.0 - Enterprise Release"
git push origin v8.0.0

# Deploy to production
kubectl apply -f k8s/production/green/ -n nox-production-green
kubectl wait --for=condition=ready pod -l app=nox-api -n nox-production-green --timeout=300s

# Switch traffic
kubectl patch ingress nox-api-ingress -n nox-production \
  -p '{"spec":{"rules":[{"http":{"paths":[{"backend":{"service":{"name":"nox-api-green"}}}]}}]}}'

# Verify production
curl -f https://api.yourdomain.com/health
curl https://api.yourdomain.com/version
```

### **Post-Release Monitoring**
```bash
# Monitor for 48 hours
watch -n 30 'kubectl get pods -n nox-production && kubectl get hpa -n nox-production'

# Check error rates
curl -s https://api.yourdomain.com/metrics | grep http_requests_total

# Validate user feedback
tail -f /var/log/user-feedback.log
```

---

**🚀 NOX API v8.0.0 - Enterprise Excellence Delivered! 🎉**

*Contact: Release Team - [Slack: #nox-releases] - [Email: releases@yourdomain.com]*

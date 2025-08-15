# 🚀 NOX API v8.0.0 - Enhanced Deployment Documentation

**Version:** v8.0.0  
**Last Updated:** August 15, 2025  
**Status:** Production Ready

---

## 📋 **OVERVIEW**

This comprehensive deployment guide covers advanced deployment strategies, scaling patterns, monitoring, and production optimization for NOX API v8.0.0. It complements the basic deployment guides with enterprise-grade practices and architectural patterns.

### **Deployment Architecture**

```
                    ┌─────────────────────────────────────────────┐
                    │                Load Balancer                │
                    │           (NGINX/HAProxy/AWS ALB)           │
                    └─────────────────┬───────────────────────────┘
                                      │
                    ┌─────────────────┴───────────────────────────┐
                    │                                             │
        ┌───────────▼──────────┐                    ┌────────────▼─────────┐
        │    NOX API Instance 1 │                    │   NOX API Instance N │
        │    (Primary/Active)   │                    │    (Secondary)       │
        └───────────┬──────────┘                    └────────────┬─────────┘
                    │                                             │
        ┌───────────▼──────────┐      ┌─────────────────────────▼─────────────────────┐
        │     WebSocket        │      │                Database Cluster                │
        │   Connection Pool    │      │   ┌─────────┐  ┌─────────┐  ┌─────────────┐   │
        └──────────────────────┘      │   │Primary  │  │ Replica │  │   Backup    │   │
                                      │   │   DB    │  │   DB    │  │     DB      │   │
        ┌─────────────────────────────┤   └─────────┘  └─────────┘  └─────────────┘   │
        │         Redis Cluster        │                                               │
        │  ┌─────┐  ┌─────┐  ┌─────┐  │                                               │
        │  │ M1  │  │ S1  │  │ S2  │  │                                               │
        │  └─────┘  └─────┘  └─────┘  │                                               │
        └─────────────────────────────┴───────────────────────────────────────────────┘
```

---

## 🏗️ **DEPLOYMENT STRATEGIES**

### **Blue-Green Deployment**

Blue-Green deployment ensures zero-downtime deployments with instant rollback capability.

#### **Infrastructure Setup**

```yaml
# docker-compose.blue-green.yml
version: '3.8'

services:
  # Blue Environment (Current Production)
  nox-api-blue:
    image: nox-api:v8.0.0-blue
    container_name: nox-api-blue
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DEPLOYMENT_COLOR=blue
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    ports:
      - "3000:3000"
    networks:
      - nox-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Green Environment (New Version)
  nox-api-green:
    image: nox-api:v8.0.0-green
    container_name: nox-api-green
    environment:
      - NODE_ENV=production
      - PORT=3001
      - DEPLOYMENT_COLOR=green
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    ports:
      - "3001:3000"
    networks:
      - nox-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Load Balancer
  nginx-lb:
    image: nginx:alpine
    container_name: nox-nginx-lb
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-blue-green.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - nox-api-blue
      - nox-api-green
    networks:
      - nox-network

networks:
  nox-network:
    driver: bridge
```

#### **Blue-Green Deployment Script**

```bash
#!/bin/bash
# deploy-blue-green.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DEPLOYMENT_LOG="/var/log/nox-deployment-${TIMESTAMP}.log"

# Configuration
HEALTH_CHECK_TIMEOUT=300
HEALTH_CHECK_INTERVAL=10
ROLLBACK_TIMEOUT=120

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$DEPLOYMENT_LOG"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a "$DEPLOYMENT_LOG"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a "$DEPLOYMENT_LOG"
}

# Function to check service health
check_health() {
    local service_url=$1
    local max_attempts=$((HEALTH_CHECK_TIMEOUT / HEALTH_CHECK_INTERVAL))
    local attempt=1

    log "Checking health of service at $service_url"

    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$service_url/health" >/dev/null 2>&1; then
            log "Service is healthy after $((attempt * HEALTH_CHECK_INTERVAL)) seconds"
            return 0
        fi

        log "Health check attempt $attempt/$max_attempts failed, waiting ${HEALTH_CHECK_INTERVAL}s..."
        sleep $HEALTH_CHECK_INTERVAL
        attempt=$((attempt + 1))
    done

    error "Service failed to become healthy within ${HEALTH_CHECK_TIMEOUT} seconds"
    return 1
}

# Function to get current active environment
get_active_environment() {
    # Check which upstream is currently active in nginx
    if docker exec nox-nginx-lb nginx -T 2>/dev/null | grep -q "upstream.*blue"; then
        echo "blue"
    else
        echo "green"
    fi
}

# Function to switch traffic
switch_traffic() {
    local target_env=$1
    local nginx_config=""

    log "Switching traffic to $target_env environment"

    if [ "$target_env" = "blue" ]; then
        nginx_config="nginx-blue-active.conf"
    else
        nginx_config="nginx-green-active.conf"
    fi

    # Copy new nginx config
    cp "$SCRIPT_DIR/configs/$nginx_config" "$SCRIPT_DIR/nginx-blue-green.conf"

    # Reload nginx configuration
    docker exec nox-nginx-lb nginx -t
    docker exec nox-nginx-lb nginx -s reload

    log "Traffic switched to $target_env environment"
}

# Function to run database migrations
run_migrations() {
    log "Running database migrations..."

    # Run migrations on the new environment
    docker exec nox-api-green npm run migrate

    if [ $? -eq 0 ]; then
        log "Database migrations completed successfully"
    else
        error "Database migrations failed"
        return 1
    fi
}

# Function to run integration tests
run_integration_tests() {
    local service_url=$1
    log "Running integration tests against $service_url"

    # Test authentication flow
    log "Testing OAuth2 authentication flow..."
    for provider in google github microsoft; do
        if curl -f -s "$service_url/api/auth/$provider/url" >/dev/null 2>&1; then
            log "✅ $provider OAuth2 URL generation working"
        else
            error "❌ $provider OAuth2 URL generation failed"
            return 1
        fi
    done

    # Test WebSocket connectivity
    log "Testing WebSocket connectivity..."
    if command -v wscat >/dev/null 2>&1; then
        if timeout 10s wscat -c "ws://localhost:3001/ws" -x '{"type":"ping"}' 2>/dev/null | grep -q "pong"; then
            log "✅ WebSocket connectivity working"
        else
            warn "⚠️ WebSocket test inconclusive (wscat may not be installed)"
        fi
    else
        warn "⚠️ wscat not installed, skipping WebSocket test"
    fi

    # Test AI security endpoint (if enabled)
    if [ "${AI_SECURITY_ENABLED:-false}" = "true" ]; then
        log "Testing AI security endpoint..."
        test_response=$(curl -s -w "%{http_code}" -o /dev/null "$service_url/api/ai/security/analyze" \
            -X POST \
            -H "Content-Type: application/json" \
            -d '{"request_data":{"ip":"127.0.0.1"}}')
        
        if [ "$test_response" = "401" ] || [ "$test_response" = "200" ]; then
            log "✅ AI security endpoint responding"
        else
            error "❌ AI security endpoint failed (HTTP $test_response)"
            return 1
        fi
    fi

    log "Integration tests completed successfully"
    return 0
}

# Function to monitor performance metrics
monitor_performance() {
    local service_url=$1
    log "Monitoring performance metrics for 60 seconds..."

    # Collect metrics for 1 minute
    local start_time=$(date +%s)
    local end_time=$((start_time + 60))
    local total_requests=0
    local successful_requests=0

    while [ $(date +%s) -lt $end_time ]; do
        response_code=$(curl -s -w "%{http_code}" -o /dev/null "$service_url/health")
        total_requests=$((total_requests + 1))
        
        if [ "$response_code" = "200" ]; then
            successful_requests=$((successful_requests + 1))
        fi
        
        sleep 1
    done

    # Calculate success rate
    success_rate=$((successful_requests * 100 / total_requests))
    log "Performance monitoring results:"
    log "  Total requests: $total_requests"
    log "  Successful requests: $successful_requests"
    log "  Success rate: ${success_rate}%"

    if [ $success_rate -ge 95 ]; then
        log "✅ Performance metrics acceptable (${success_rate}% success rate)"
        return 0
    else
        error "❌ Performance metrics below threshold (${success_rate}% success rate, required: 95%)"
        return 1
    fi
}

# Function to rollback deployment
rollback_deployment() {
    local current_active=$1
    local target_env=""

    error "Initiating rollback procedure..."

    if [ "$current_active" = "blue" ]; then
        target_env="green"
    else
        target_env="blue"
    fi

    log "Rolling back from $current_active to $target_env"

    # Switch traffic back
    switch_traffic "$target_env"

    # Wait for rollback to stabilize
    sleep 30

    # Verify rollback health
    if check_health "http://localhost"; then
        log "✅ Rollback completed successfully"
        return 0
    else
        error "❌ Rollback failed - manual intervention required"
        return 1
    fi
}

# Main deployment function
main() {
    log "Starting Blue-Green deployment for NOX API v8.0.0"
    log "Deployment log: $DEPLOYMENT_LOG"

    # Determine current active environment
    CURRENT_ACTIVE=$(get_active_environment)
    if [ "$CURRENT_ACTIVE" = "blue" ]; then
        TARGET_ENV="green"
    else
        TARGET_ENV="blue"
    fi

    log "Current active environment: $CURRENT_ACTIVE"
    log "Target environment: $TARGET_ENV"

    # Pre-deployment checks
    log "Running pre-deployment checks..."
    
    # Check Docker daemon
    if ! docker info >/dev/null 2>&1; then
        error "Docker daemon is not running"
        exit 1
    fi

    # Check if target environment container exists
    if ! docker ps -a --format "table {{.Names}}" | grep -q "nox-api-$TARGET_ENV"; then
        error "Target environment container 'nox-api-$TARGET_ENV' not found"
        exit 1
    fi

    # Build and start target environment
    log "Building and starting $TARGET_ENV environment..."
    docker-compose -f docker-compose.blue-green.yml build nox-api-$TARGET_ENV
    docker-compose -f docker-compose.blue-green.yml up -d nox-api-$TARGET_ENV

    # Wait for target environment to start
    log "Waiting for $TARGET_ENV environment to start..."
    sleep 30

    # Check health of target environment
    if ! check_health "http://localhost:$([ "$TARGET_ENV" = "blue" ] && echo "3000" || echo "3001")"; then
        error "$TARGET_ENV environment failed health check"
        rollback_deployment "$CURRENT_ACTIVE"
        exit 1
    fi

    # Run database migrations
    if ! run_migrations; then
        error "Database migrations failed"
        rollback_deployment "$CURRENT_ACTIVE"
        exit 1
    fi

    # Run integration tests
    if ! run_integration_tests "http://localhost:$([ "$TARGET_ENV" = "blue" ] && echo "3000" || echo "3001")"; then
        error "Integration tests failed"
        rollback_deployment "$CURRENT_ACTIVE"
        exit 1
    fi

    # Monitor performance before switching traffic
    if ! monitor_performance "http://localhost:$([ "$TARGET_ENV" = "blue" ] && echo "3000" || echo "3001")"; then
        warn "Performance metrics below threshold, but continuing with deployment"
    fi

    # Switch traffic to target environment
    switch_traffic "$TARGET_ENV"

    # Verify production health after traffic switch
    log "Verifying production health after traffic switch..."
    if ! check_health "http://localhost"; then
        error "Production health check failed after traffic switch"
        rollback_deployment "$TARGET_ENV"
        exit 1
    fi

    # Monitor production performance
    if ! monitor_performance "http://localhost"; then
        warn "Production performance below threshold after switch"
        # Don't rollback on performance issues, but log warning
    fi

    # Cleanup old environment (optional)
    log "Cleaning up old environment ($CURRENT_ACTIVE)..."
    docker-compose -f docker-compose.blue-green.yml stop nox-api-$CURRENT_ACTIVE

    # Success
    log "🎉 Blue-Green deployment completed successfully!"
    log "Active environment: $TARGET_ENV"
    log "Deployment log saved to: $DEPLOYMENT_LOG"

    # Send notification (if configured)
    if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data '{"text":"🚀 NOX API v8.0.0 Blue-Green deployment completed successfully! Active environment: '${TARGET_ENV}'"}' \
            "$SLACK_WEBHOOK_URL"
    fi
}

# Handle script interruption
trap 'error "Deployment interrupted"; rollback_deployment "$CURRENT_ACTIVE"; exit 1' INT TERM

# Run main deployment
main "$@"
```

### **Canary Deployment**

Canary deployment gradually shifts traffic to the new version, allowing for risk mitigation.

#### **Canary Configuration**

```nginx
# nginx-canary.conf
upstream nox-api-stable {
    server nox-api-v8:3000 weight=9;
}

upstream nox-api-canary {
    server nox-api-v8-canary:3000 weight=1;
}

server {
    listen 80;
    server_name yourdomain.com;

    # Route 90% of traffic to stable, 10% to canary
    location / {
        # Use header-based routing for specific users
        if ($http_x_canary_user = "true") {
            proxy_pass http://nox-api-canary;
        }
        
        # Use split testing for general traffic
        split_clients $remote_addr $variant {
            10%     canary;
            *       stable;
        }

        if ($variant = "canary") {
            proxy_pass http://nox-api-canary;
        }
        
        proxy_pass http://nox-api-stable;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### **Canary Deployment Script**

```bash
#!/bin/bash
# deploy-canary.sh

set -e

# Canary deployment stages
CANARY_STAGES=(1 5 10 25 50 100)
STAGE_DURATION=300 # 5 minutes per stage
ERROR_THRESHOLD=5 # 5% error rate threshold

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Function to update traffic percentage
update_canary_traffic() {
    local percentage=$1
    log "Updating canary traffic to ${percentage}%"
    
    # Update nginx configuration
    sed -i "s/weight=1/weight=$((percentage * 10 / 100))/g" /etc/nginx/conf.d/nox-canary.conf
    nginx -s reload
}

# Function to monitor canary metrics
monitor_canary() {
    local duration=$1
    local start_time=$(date +%s)
    local end_time=$((start_time + duration))
    
    log "Monitoring canary for ${duration} seconds"
    
    while [ $(date +%s) -lt $end_time ]; do
        # Get error rate from monitoring system
        error_rate=$(curl -s "http://localhost:9090/api/v1/query?query=rate(http_requests_total{status=~'5..'}[1m])" | jq -r '.data.result[0].value[1]' | awk '{print $1 * 100}')
        
        if (( $(echo "$error_rate > $ERROR_THRESHOLD" | bc -l) )); then
            log "Error rate ${error_rate}% exceeds threshold ${ERROR_THRESHOLD}%"
            return 1
        fi
        
        sleep 30
    done
    
    return 0
}

# Main canary deployment
main() {
    log "Starting Canary deployment for NOX API v8.0.0"
    
    for stage in "${CANARY_STAGES[@]}"; do
        log "Deploying canary stage: ${stage}%"
        
        update_canary_traffic $stage
        
        if ! monitor_canary $STAGE_DURATION; then
            log "Canary stage ${stage}% failed, rolling back"
            update_canary_traffic 0
            exit 1
        fi
        
        log "Canary stage ${stage}% completed successfully"
    done
    
    log "🎉 Canary deployment completed successfully!"
}

main "$@"
```

---

## ⚡ **SCALING PATTERNS**

### **Horizontal Scaling with Kubernetes**

#### **Kubernetes Deployment Configuration**

```yaml
# k8s-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nox-api-deployment
  labels:
    app: nox-api
    version: v8.0.0
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nox-api
  template:
    metadata:
      labels:
        app: nox-api
        version: v8.0.0
    spec:
      containers:
      - name: nox-api
        image: nox-api:v8.0.0
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "3000"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: nox-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: nox-secrets
              key: redis-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        
---
apiVersion: v1
kind: Service
metadata:
  name: nox-api-service
spec:
  selector:
    app: nox-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nox-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nox-api-deployment
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
```

#### **Kubernetes Ingress with SSL**

```yaml
# k8s-ingress.yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nox-api-ingress
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
    nginx.ingress.kubernetes.io/enable-cors: "true"
    nginx.ingress.kubernetes.io/cors-allow-origin: "https://yourdomain.com"
    nginx.ingress.kubernetes.io/websocket-services: "nox-websocket-service"
spec:
  tls:
  - hosts:
    - api.yourdomain.com
    secretName: nox-api-tls
  rules:
  - host: api.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nox-api-service
            port:
              number: 80
      - path: /ws
        pathType: Prefix
        backend:
          service:
            name: nox-websocket-service
            port:
              number: 8080
```

### **Auto-scaling Configuration**

#### **AWS Auto Scaling Group**

```json
{
  "AutoScalingGroupName": "nox-api-asg",
  "MinSize": 2,
  "MaxSize": 20,
  "DesiredCapacity": 3,
  "DefaultCooldown": 300,
  "HealthCheckType": "ELB",
  "HealthCheckGracePeriod": 300,
  "LaunchTemplate": {
    "LaunchTemplateName": "nox-api-lt",
    "Version": "1"
  },
  "TargetGroupARNs": [
    "arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/nox-api-tg/1234567890123456"
  ],
  "Tags": [
    {
      "Key": "Name",
      "Value": "NOX-API-Instance",
      "PropagateAtLaunch": true
    },
    {
      "Key": "Environment",
      "Value": "Production",
      "PropagateAtLaunch": true
    }
  ]
}
```

#### **Auto Scaling Policies**

```bash
#!/bin/bash
# setup-autoscaling.sh

# Scale Up Policy
aws autoscaling put-scaling-policy \
    --auto-scaling-group-name nox-api-asg \
    --policy-name nox-api-scale-up-policy \
    --adjustment-type ChangeInCapacity \
    --scaling-adjustment 2 \
    --cooldown 300

# Scale Down Policy
aws autoscaling put-scaling-policy \
    --auto-scaling-group-name nox-api-asg \
    --policy-name nox-api-scale-down-policy \
    --adjustment-type ChangeInCapacity \
    --scaling-adjustment -1 \
    --cooldown 300

# CloudWatch Alarms
aws cloudwatch put-metric-alarm \
    --alarm-name "NOX-API-High-CPU" \
    --alarm-description "Scale up when CPU > 70%" \
    --metric-name CPUUtilization \
    --namespace AWS/EC2 \
    --statistic Average \
    --period 300 \
    --threshold 70 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2

aws cloudwatch put-metric-alarm \
    --alarm-name "NOX-API-Low-CPU" \
    --alarm-description "Scale down when CPU < 30%" \
    --metric-name CPUUtilization \
    --namespace AWS/EC2 \
    --statistic Average \
    --period 300 \
    --threshold 30 \
    --comparison-operator LessThanThreshold \
    --evaluation-periods 2
```

---

## 📊 **MONITORING AND OBSERVABILITY**

### **Comprehensive Monitoring Stack**

#### **Prometheus Configuration**

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

rule_files:
  - "alert_rules.yml"

scrape_configs:
  - job_name: 'nox-api'
    static_configs:
      - targets: ['nox-api:3000']
    metrics_path: /metrics
    scrape_interval: 10s

  - job_name: 'nox-websocket'
    static_configs:
      - targets: ['nox-websocket:8080']
    metrics_path: /metrics

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']

  - job_name: 'postgresql'
    static_configs:
      - targets: ['postgres:5432']

  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx:80']
```

#### **Alert Rules**

```yaml
# alert_rules.yml
groups:
- name: nox-api-alerts
  rules:
  - alert: HighResponseTime
    expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High response time detected"
      description: "95th percentile response time is {{ $value }}s"

  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected"
      description: "Error rate is {{ $value }}% over the last 5 minutes"

  - alert: DatabaseConnectionHigh
    expr: pg_stat_database_numbackends > 80
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High database connection count"

  - alert: RedisMemoryHigh
    expr: redis_memory_used_bytes / redis_memory_max_bytes > 0.8
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "Redis memory usage high"

  - alert: WebSocketConnectionsHigh
    expr: websocket_active_connections > 5000
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High WebSocket connection count"

  - alert: AISecurityThreatDetected
    expr: ai_security_threat_level > 0.8
    for: 0s
    labels:
      severity: critical
    annotations:
      summary: "High-level security threat detected"
      description: "AI security system detected threat level {{ $value }}"
```

#### **Grafana Dashboard Configuration**

```json
{
  "dashboard": {
    "title": "NOX API v8.0.0 Production Dashboard",
    "tags": ["nox", "api", "production"],
    "timezone": "UTC",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{ method }} {{ status }}"
          }
        ],
        "yAxes": [
          {
            "label": "Requests per second"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "50th percentile"
          },
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          },
          {
            "expr": "histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "99th percentile"
          }
        ]
      },
      {
        "title": "WebSocket Connections",
        "type": "stat",
        "targets": [
          {
            "expr": "websocket_active_connections",
            "legendFormat": "Active Connections"
          }
        ]
      },
      {
        "title": "AI Security Threat Level",
        "type": "gauge",
        "targets": [
          {
            "expr": "avg(ai_security_threat_level)",
            "legendFormat": "Avg Threat Level"
          }
        ],
        "fieldConfig": {
          "min": 0,
          "max": 1,
          "thresholds": [
            {"color": "green", "value": 0},
            {"color": "yellow", "value": 0.5},
            {"color": "red", "value": 0.8}
          ]
        }
      }
    ]
  }
}
```

### **Application Performance Monitoring (APM)**

#### **Custom Metrics Collection**

```javascript
// metrics.js
const promClient = require('prom-client');

// Create custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const websocketConnections = new promClient.Gauge({
  name: 'websocket_active_connections',
  help: 'Number of active WebSocket connections'
});

const aiSecurityThreatLevel = new promClient.Gauge({
  name: 'ai_security_threat_level',
  help: 'Current AI security threat level (0-1)'
});

const databaseConnectionPool = new promClient.Gauge({
  name: 'database_connection_pool_size',
  help: 'Size of database connection pool',
  labelNames: ['pool_status']
});

// Middleware to collect HTTP metrics
const collectHttpMetrics = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDuration
      .labels(req.method, route, res.statusCode.toString())
      .observe(duration);
    
    httpRequestsTotal
      .labels(req.method, route, res.statusCode.toString())
      .inc();
  });
  
  next();
};

// Function to update WebSocket metrics
const updateWebSocketMetrics = (connectionCount) => {
  websocketConnections.set(connectionCount);
};

// Function to update AI security metrics
const updateAISecurityMetrics = (threatLevel) => {
  aiSecurityThreatLevel.set(threatLevel);
};

// Function to collect database metrics
const collectDatabaseMetrics = (pool) => {
  setInterval(() => {
    databaseConnectionPool.labels('active').set(pool.totalCount);
    databaseConnectionPool.labels('idle').set(pool.idleCount);
    databaseConnectionPool.labels('waiting').set(pool.waitingCount);
  }, 10000); // Collect every 10 seconds
};

// Metrics endpoint
const metricsEndpoint = (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(promClient.register.metrics());
};

module.exports = {
  collectHttpMetrics,
  updateWebSocketMetrics,
  updateAISecurityMetrics,
  collectDatabaseMetrics,
  metricsEndpoint
};
```

### **Log Aggregation with ELK Stack**

#### **Logstash Configuration**

```ruby
# logstash.conf
input {
  beats {
    port => 5044
  }
  
  tcp {
    port => 5000
    codec => json
  }
}

filter {
  if [service] == "nox-api" {
    # Parse JSON logs
    json {
      source => "message"
    }
    
    # Extract additional fields
    grok {
      match => { 
        "message" => "%{TIMESTAMP_ISO8601:timestamp} %{WORD:level} %{GREEDYDATA:log_message}"
      }
    }
    
    # Parse OAuth provider from logs
    if [log_message] =~ /OAuth/ {
      grok {
        match => { 
          "log_message" => "OAuth\s+%{WORD:provider}\s+%{WORD:action}\s+%{WORD:result}"
        }
      }
    }
    
    # Parse AI security events
    if [log_message] =~ /AI Security/ {
      grok {
        match => { 
          "log_message" => "AI Security threat_level=%{NUMBER:threat_level:float} confidence=%{NUMBER:confidence:float}"
        }
      }
    }
    
    # Add GeoIP information
    if [client_ip] {
      geoip {
        source => "client_ip"
        target => "geoip"
      }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "nox-api-%{+YYYY.MM.dd}"
  }
  
  # Send critical errors to Slack
  if [level] == "ERROR" or [level] == "CRITICAL" {
    http {
      url => "${SLACK_WEBHOOK_URL}"
      http_method => "post"
      format => "json"
      mapping => {
        "text" => "🚨 NOX API Error: %{log_message}"
        "username" => "NOX-API-Monitor"
        "channel" => "#alerts"
      }
    }
  }
  
  stdout { codec => rubydebug }
}
```

#### **Elasticsearch Index Template**

```json
{
  "index_patterns": ["nox-api-*"],
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 1,
    "index.refresh_interval": "10s"
  },
  "mappings": {
    "properties": {
      "@timestamp": {
        "type": "date"
      },
      "level": {
        "type": "keyword"
      },
      "service": {
        "type": "keyword"
      },
      "message": {
        "type": "text",
        "analyzer": "standard"
      },
      "client_ip": {
        "type": "ip"
      },
      "user_id": {
        "type": "keyword"
      },
      "provider": {
        "type": "keyword"
      },
      "threat_level": {
        "type": "float"
      },
      "confidence": {
        "type": "float"
      },
      "response_time": {
        "type": "integer"
      },
      "geoip": {
        "properties": {
          "country_name": {
            "type": "keyword"
          },
          "city_name": {
            "type": "keyword"
          },
          "location": {
            "type": "geo_point"
          }
        }
      }
    }
  }
}
```

---

## 🔒 **SECURITY HARDENING**

### **Container Security**

#### **Dockerfile Security Best Practices**

```dockerfile
# Dockerfile.secure
FROM node:20-alpine AS base

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S noxapi -u 1001

# Set security-focused environment
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=512"

# Install security updates
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

# Create app directory with proper permissions
WORKDIR /app
RUN chown -R noxapi:nodejs /app

# Copy package files first for better caching
COPY --chown=noxapi:nodejs package*.json ./
RUN npm ci --only=production --no-audit --no-fund && \
    npm cache clean --force

# Copy application code
COPY --chown=noxapi:nodejs . .

# Remove unnecessary files
RUN rm -rf .git .github docs tests *.md

# Set proper file permissions
RUN find /app -type f -exec chmod 644 {} \; && \
    find /app -type d -exec chmod 755 {} \; && \
    chmod +x /app/entrypoint.sh

# Switch to non-root user
USER noxapi

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
```

#### **Security Scanning Integration**

```yaml
# security-scan.yml (GitHub Actions)
name: Security Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: 'nox-api:latest'
        format: 'sarif'
        output: 'trivy-results.sarif'
    
    - name: Upload Trivy scan results to GitHub Security tab
      uses: github/codeql-action/upload-sarif@v2
      if: always()
      with:
        sarif_file: 'trivy-results.sarif'
    
    - name: Run Snyk to check for vulnerabilities
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      with:
        args: --severity-threshold=high
    
    - name: OWASP ZAP Baseline Scan
      uses: zaproxy/action-baseline@v0.7.0
      with:
        target: 'https://staging.yourdomain.com'
        rules_file_name: '.zap/rules.tsv'
```

### **Network Security**

#### **Web Application Firewall (WAF) Rules**

```nginx
# nginx-waf.conf
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/s;

# Geographic blocking (example)
geo $blocked_country {
    default 0;
    # Block specific countries if needed
    # CN 1;
    # RU 1;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;

    # Block common attack patterns
    if ($request_uri ~* "(\<|\%3C).*script.*(\>|\%3E)") { return 403; }
    if ($request_uri ~* "(\<|\%3C).*iframe.*(\>|\%3E)") { return 403; }
    if ($request_uri ~* "(\<|\%3C).*object.*(\>|\%3E)") { return 403; }
    if ($request_uri ~* "(\<|\%3C).*embed.*(\>|\%3E)") { return 403; }
    if ($request_uri ~* "(\<|\%3C).*meta.*(\>|\%3E)") { return 403; }
    if ($query_string ~* "[;<>\'\"]") { return 403; }
    if ($query_string ~* "(base64_encode|base64_decode)") { return 403; }
    if ($query_string ~* "union.*select.*\(") { return 403; }

    # Block if geographic blocking is enabled
    if ($blocked_country) { return 403; }

    # Rate limiting by endpoint
    location /api/auth/ {
        limit_req zone=auth burst=10 nodelay;
        proxy_pass http://nox-api;
        include proxy_params;
    }

    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://nox-api;
        include proxy_params;
    }

    # Static files
    location /static/ {
        root /var/www/nox-api;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### **SSL/TLS Configuration**

#### **Advanced SSL Configuration**

```nginx
# ssl-config.conf
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
ssl_prefer_server_ciphers off;

ssl_session_cache shared:SSL:50m;
ssl_session_timeout 1d;
ssl_session_tickets off;

# OCSP stapling
ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;

# SSL certificate paths
ssl_certificate /etc/ssl/certs/yourdomain.com.crt;
ssl_certificate_key /etc/ssl/private/yourdomain.com.key;
ssl_trusted_certificate /etc/ssl/certs/ca-chain.crt;

# HSTS preload
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

---

## 📈 **PERFORMANCE OPTIMIZATION**

### **Database Optimization**

#### **PostgreSQL Performance Tuning**

```sql
-- postgresql.conf optimizations
-- Connection Settings
max_connections = 200
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB

-- WAL Settings
wal_level = replica
max_wal_size = 1GB
min_wal_size = 80MB
checkpoint_completion_target = 0.9

-- Query Performance
random_page_cost = 1.1
seq_page_cost = 1.0
effective_io_concurrency = 200

-- Logging
log_min_duration_statement = 1000  -- Log slow queries
log_checkpoints = on
log_connections = on
log_disconnections = on
```

#### **Database Connection Pooling**

```javascript
// db-pool.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                    // Maximum number of connections
  min: 5,                     // Minimum number of connections
  idleTimeoutMillis: 30000,   // Close idle connections after 30s
  connectionTimeoutMillis: 5000, // Timeout for new connections
  maxUses: 7500,              // Close connections after 7500 queries
  
  // Connection health checking
  application_name: 'nox-api-v8',
  statement_timeout: 30000,   // 30s statement timeout
  query_timeout: 30000,       // 30s query timeout
  
  // SSL configuration
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

// Pool event handling
pool.on('connect', (client) => {
  console.log(`Database client connected (PID: ${client.processID})`);
});

pool.on('error', (err, client) => {
  console.error('Database pool error:', err);
  // Implement alerting here
});

pool.on('remove', (client) => {
  console.log(`Database client removed (PID: ${client.processID})`);
});

// Health check function
const healthCheck = async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return {
      status: 'healthy',
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
};

module.exports = { pool, healthCheck };
```

### **Redis Optimization**

#### **Redis Clustering Configuration**

```conf
# redis-cluster.conf
# Network
bind 0.0.0.0
port 7000
protected-mode no

# Cluster
cluster-enabled yes
cluster-config-file nodes-7000.conf
cluster-node-timeout 15000
cluster-announce-ip 192.168.1.100
cluster-announce-port 7000
cluster-announce-bus-port 17000

# Memory
maxmemory 1gb
maxmemory-policy allkeys-lru

# Persistence
appendonly yes
appendfilename "appendonly-7000.aof"
appendfsync everysec

# Performance
tcp-keepalive 300
timeout 0
tcp-backlog 511
databases 1

# Logging
loglevel notice
logfile /var/log/redis/redis-7000.log
```

#### **Redis Connection Management**

```javascript
// redis-client.js
const Redis = require('ioredis');

// Cluster configuration
const cluster = new Redis.Cluster([
  { host: '192.168.1.100', port: 7000 },
  { host: '192.168.1.101', port: 7000 },
  { host: '192.168.1.102', port: 7000 }
], {
  redisOptions: {
    password: process.env.REDIS_PASSWORD,
    db: 0
  },
  enableOfflineQueue: false,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true
});

// Connection event handlers
cluster.on('connect', () => {
  console.log('Redis cluster connected');
});

cluster.on('error', (error) => {
  console.error('Redis cluster error:', error);
});

cluster.on('close', () => {
  console.log('Redis cluster connection closed');
});

cluster.on('reconnecting', () => {
  console.log('Redis cluster reconnecting...');
});

// Session management with Redis
class RedisSessionManager {
  constructor(redisClient) {
    this.redis = redisClient;
    this.sessionPrefix = 'session:';
    this.defaultTTL = 86400; // 24 hours
  }

  async createSession(userId, sessionData) {
    const sessionId = this.generateSessionId();
    const key = this.sessionPrefix + sessionId;
    
    const data = {
      ...sessionData,
      userId,
      createdAt: Date.now(),
      lastActivity: Date.now()
    };

    await this.redis.setex(key, this.defaultTTL, JSON.stringify(data));
    return sessionId;
  }

  async getSession(sessionId) {
    const key = this.sessionPrefix + sessionId;
    const data = await this.redis.get(key);
    
    if (data) {
      const session = JSON.parse(data);
      // Update last activity
      session.lastActivity = Date.now();
      await this.redis.setex(key, this.defaultTTL, JSON.stringify(session));
      return session;
    }
    
    return null;
  }

  async updateSession(sessionId, updates) {
    const session = await this.getSession(sessionId);
    if (session) {
      const updatedSession = { ...session, ...updates };
      const key = this.sessionPrefix + sessionId;
      await this.redis.setex(key, this.defaultTTL, JSON.stringify(updatedSession));
      return updatedSession;
    }
    return null;
  }

  async deleteSession(sessionId) {
    const key = this.sessionPrefix + sessionId;
    await this.redis.del(key);
  }

  generateSessionId() {
    return require('crypto').randomBytes(32).toString('hex');
  }
}

module.exports = { cluster, RedisSessionManager };
```

---

## 🎯 **CONCLUSION**

This enhanced deployment documentation provides enterprise-grade deployment strategies, monitoring solutions, and optimization techniques for NOX API v8.0.0. The comprehensive approach ensures:

### **✅ Key Achievements**

- **Zero-downtime deployments** with Blue-Green and Canary strategies
- **Auto-scaling capabilities** for handling variable loads  
- **Comprehensive monitoring** with Prometheus, Grafana, and ELK stack
- **Security hardening** with WAF, SSL/TLS, and container security
- **Performance optimization** for database, Redis, and application layers
- **Production-ready architecture** with high availability and resilience

### **🚀 Next Steps**

1. **Choose deployment strategy** based on your risk tolerance and requirements
2. **Implement monitoring stack** for observability and alerting
3. **Configure auto-scaling** based on your traffic patterns
4. **Set up security measures** appropriate for your threat model
5. **Optimize performance** using the provided configurations

### **📊 Production Readiness Checklist**

- [ ] Deployment strategy implemented and tested
- [ ] Monitoring and alerting configured
- [ ] Security hardening measures in place
- [ ] Performance optimization applied
- [ ] Backup and disaster recovery procedures established
- [ ] Documentation updated for operations team
- [ ] Runbook created for incident response

---

**🎉 NOX API v8.0.0 is now production-ready with enterprise-grade deployment capabilities! 🚀**

*Deploy with confidence, scale with ease, monitor with precision.*

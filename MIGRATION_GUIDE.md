# 🚀 NOX API v8.0.0 - Migration Guide

**Version:** v8.0.0  
**Last Updated:** August 15, 2025  
**Status:** Production Ready

---

## 📋 **OVERVIEW**

This comprehensive migration guide helps existing NOX API users upgrade to v8.0.0. Whether you're migrating from v7.x, v6.x, or earlier versions, this guide provides step-by-step instructions to ensure a smooth transition.

### **What's New in v8.0.0**

#### **🔥 Major Features**

- ✅ **AI-Powered Security** - ML-based threat detection and policy enforcement
- ✅ **Performance Optimization** - 40-60% bundle size reduction, WebVitals monitoring
- ✅ **Interactive Documentation** - Real-time API testing and code generation
- ✅ **Enhanced OAuth2** - Multi-provider support with refresh tokens
- ✅ **WebSocket Support** - Real-time notifications and updates
- ✅ **Biometric Authentication** - Advanced security options
- ✅ **Production Deployment** - Complete automation and monitoring

#### **🔄 Breaking Changes**

- OAuth2 callback URLs updated
- New authentication flow with refresh tokens
- AI endpoints require additional permissions
- Performance monitoring enabled by default
- Updated API response formats
- New environment variables required

---

## 🎯 **PRE-MIGRATION CHECKLIST**

### **Before You Start**

- [ ] **Backup current installation and database**
- [ ] **Review current OAuth2 provider configurations**
- [ ] **Test migration in staging environment first**
- [ ] **Notify users of planned maintenance window**
- [ ] **Prepare rollback plan in case of issues**
- [ ] **Review new environment variables requirements**
- [ ] **Check system requirements (Node.js 18+, Redis, PostgreSQL)**

### **System Requirements**

**Minimum Requirements:**

```text
Node.js: 18.0.0+
NPM: 8.0.0+
Redis: 6.0+
PostgreSQL: 12.0+ (optional but recommended)
Memory: 2GB RAM minimum
Storage: 10GB available space
SSL Certificate: Required for production
```

**Recommended Requirements:**

```text
Node.js: 20.0.0+
NPM: 10.0.0+
Redis: 7.0+
PostgreSQL: 15.0+
Memory: 4GB+ RAM
Storage: 20GB+ available space
CDN: For static asset delivery
Load Balancer: For high availability
```

---

## 📂 **MIGRATION PATHS**

### **From v7.x to v8.0.0**

This is the most common migration path with moderate breaking changes.

#### **Step 1: Environment Preparation**

**Update Environment Variables:**

```bash
# New required variables in v8.0.0
cat >> .env << 'EOF'

# AI Security Configuration
AI_SECURITY_ENABLED=true
AI_THREAT_THRESHOLD=0.7
AI_BIOMETRIC_ENABLED=false

# Performance Monitoring
WEBVITALS_ENABLED=true
PERFORMANCE_MONITORING=true
BUNDLE_ANALYZER_ENABLED=false

# WebSocket Configuration
WEBSOCKET_ENABLED=true
WEBSOCKET_PORT=8080
WEBSOCKET_HEARTBEAT_INTERVAL=30000

# Enhanced OAuth2
OAUTH_REFRESH_TOKEN_ENABLED=true
OAUTH_TOKEN_ROTATION=true
OAUTH_SESSION_TIMEOUT=86400

# Production Deployment
DEPLOYMENT_ENVIRONMENT=production
HEALTH_CHECK_ENABLED=true
METRICS_COLLECTION=true
EOF
```

**Update OAuth2 Redirect URIs:**

Add new callback endpoints to your OAuth providers:

```text
Google Console:
- Add: https://yourdomain.com/api/auth/google/callback
- Add: https://yourdomain.com/auth/callback/google

GitHub Settings:
- Add: https://yourdomain.com/api/auth/github/callback
- Add: https://yourdomain.com/auth/callback/github

Microsoft Azure:
- Add: https://yourdomain.com/api/auth/microsoft/callback
- Add: https://yourdomain.com/auth/callback/microsoft
```

#### **Step 2: Database Migration**

**Run Migration Scripts:**

```bash
# Backup existing database
pg_dump nox_api > nox_api_v7_backup.sql

# Run v8.0.0 migrations
npm run migrate:v8.0.0

# Verify migration
npm run verify:migration
```

**Migration SQL (if running manually):**

```sql
-- Add AI security tables
CREATE TABLE IF NOT EXISTS ai_security_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  threat_level VARCHAR(20),
  confidence DECIMAL(3,2),
  detected_threats JSONB,
  request_data JSONB,
  analysis_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add performance monitoring tables
CREATE TABLE IF NOT EXISTS performance_metrics (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255),
  metric_name VARCHAR(100),
  metric_value DECIMAL(10,4),
  metric_unit VARCHAR(20),
  metadata JSONB,
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- Add WebSocket session tracking
CREATE TABLE IF NOT EXISTS websocket_sessions (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  connection_id VARCHAR(255) UNIQUE,
  connected_at TIMESTAMP DEFAULT NOW(),
  last_heartbeat TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'connected'
);

-- Update existing users table for v8.0.0
ALTER TABLE users ADD COLUMN IF NOT EXISTS biometric_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_security_scan TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS security_risk_score DECIMAL(3,2) DEFAULT 0.0;

-- Add indexes for performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_security_logs_user_id ON ai_security_logs(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_security_logs_created_at ON ai_security_logs(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_performance_metrics_session_id ON performance_metrics(session_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_websocket_sessions_user_id ON websocket_sessions(user_id);
```

#### **Step 3: Code Migration**

**Update Authentication Calls:**

**Old v7.x Code:**

```javascript
// v7.x authentication
const authResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ provider: 'google' })
});

const { token } = await authResponse.json();
localStorage.setItem('nox_token', token);
```

**New v8.0.0 Code:**

```javascript
// v8.0.0 authentication with refresh tokens
const authUrl = await fetch('/api/auth/google/url').then(r => r.json());
window.location.href = authUrl.url;

// Handle callback (in callback page)
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

if (code) {
  const tokenResponse = await fetch('/api/auth/google/callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });

  const { access_token, refresh_token, expires_in } = await tokenResponse.json();
  
  // Store tokens securely
  tokenManager.setTokens({ access_token, refresh_token, expires_in });
}
```

**Update API Calls:**

**Old v7.x Code:**

```javascript
// v7.x API calls
const response = await fetch('/api/user/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

**New v8.0.0 Code:**

```javascript
// v8.0.0 API calls with automatic token refresh
const response = await authenticatedFetch('/api/user/profile');

// Or using the SDK
const client = new NOXClient({ baseUrl: process.env.NOX_API_URL });
const profile = await client.getUserProfile();
```

#### **Step 4: Frontend Integration**

**Update HTML/JavaScript:**

**Old v7.x Integration:**

```html
<!DOCTYPE html>
<html>
<head>
  <title>My App - NOX v7.x</title>
</head>
<body>
  <div id="auth-container">
    <button onclick="login()">Login with Google</button>
  </div>

  <script>
    function login() {
      window.location.href = '/api/auth/google';
    }
  </script>
</body>
</html>
```

**New v8.0.0 Integration:**

```html
<!DOCTYPE html>
<html>
<head>
  <title>My App - NOX v8.0.0</title>
  <script src="/js/nox-sdk-v8.min.js"></script>
</head>
<body>
  <div id="auth-container">
    <button onclick="login()">Login with Google</button>
    <div id="user-profile" style="display:none;"></div>
  </div>

  <script>
    const noxClient = new NOXClient({
      baseUrl: window.location.origin,
      enablePerformanceMonitoring: true,
      enableWebSockets: true
    });

    async function login() {
      try {
        const authUrl = await noxClient.getAuthUrl('google', '/callback');
        window.location.href = authUrl;
      } catch (error) {
        console.error('Login failed:', error);
      }
    }

    // Handle callback
    if (window.location.pathname === '/callback') {
      handleAuthCallback();
    }

    async function handleAuthCallback() {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        try {
          const tokens = await noxClient.exchangeCode(code, 'google');
          noxClient.setTokens(tokens);
          
          // Redirect to main app
          window.location.href = '/';
        } catch (error) {
          console.error('Token exchange failed:', error);
        }
      }
    }
  </script>
</body>
</html>
```

### **From v6.x and Earlier to v8.0.0**

For older versions, we recommend a staged migration approach.

#### **Option 1: Direct Migration (High Risk)**

Follow the v7.x migration steps above, plus:

**Additional Database Changes:**

```sql
-- Major schema updates for pre-v7.x versions
ALTER TABLE users DROP COLUMN IF EXISTS old_token_field;
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_user_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Migrate existing authentication data
UPDATE users SET provider = 'legacy' WHERE provider IS NULL;
```

**Additional Environment Variables:**

```bash
# Legacy compatibility
LEGACY_TOKEN_SUPPORT=false
MIGRATION_MODE=false
BACKWARD_COMPATIBILITY=false
```

#### **Option 2: Staged Migration (Recommended)**

1. **Migrate to v7.x first**
2. **Test thoroughly**
3. **Then migrate to v8.0.0**

This approach reduces risk and allows for better testing.

---

## 🔄 **CONFIGURATION MIGRATION**

### **Environment Variables Mapping**

**v7.x → v8.0.0 Environment Variable Changes:**

| v7.x | v8.0.0 | Notes |
|------|--------|-------|
| `AUTH_SECRET` | `JWT_SECRET` | Renamed for clarity |
| `DB_URL` | `DATABASE_URL` | Standard naming |
| `REDIS_URL` | `REDIS_URL` | Unchanged |
| `PORT` | `PORT` | Unchanged |
| `NODE_ENV` | `NODE_ENV` | Unchanged |
| - | `AI_SECURITY_ENABLED` | New in v8.0.0 |
| - | `WEBVITALS_ENABLED` | New in v8.0.0 |
| - | `WEBSOCKET_ENABLED` | New in v8.0.0 |

**Complete v8.0.0 Configuration:**

```bash
# Core Application
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/nox_api
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-here
JWT_EXPIRES_IN=3600
JWT_REFRESH_EXPIRES_IN=604800

# OAuth2 Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret

# AI Security
AI_SECURITY_ENABLED=true
AI_THREAT_THRESHOLD=0.7
AI_BIOMETRIC_ENABLED=false
AI_SECURITY_MODEL_URL=https://api.openai.com/v1

# Performance Monitoring
WEBVITALS_ENABLED=true
PERFORMANCE_MONITORING=true
BUNDLE_ANALYZER_ENABLED=false
METRICS_COLLECTION_INTERVAL=60000

# WebSocket Configuration
WEBSOCKET_ENABLED=true
WEBSOCKET_PORT=8080
WEBSOCKET_HEARTBEAT_INTERVAL=30000
WEBSOCKET_MAX_CONNECTIONS=10000

# Production Settings
DEPLOYMENT_ENVIRONMENT=production
HEALTH_CHECK_ENABLED=true
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
CORS_ORIGIN=https://yourdomain.com
CSRF_SECRET=your-csrf-secret
SESSION_SECRET=your-session-secret
HELMET_ENABLED=true
```

### **Nginx Configuration Updates**

**Old v7.x Nginx Config:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**New v8.0.0 Nginx Config:**

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/ssl/certs/yourdomain.com.crt;
    ssl_certificate_key /etc/ssl/private/yourdomain.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;

    # Main application
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }

    # WebSocket endpoint
    location /ws {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # Static assets with caching
    location /static/ {
        root /var/www/nox-api;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check
    location /health {
        access_log off;
        proxy_pass http://localhost:3000/health;
    }
}
```

---

## ⚠️ **BREAKING CHANGES DETAILS**

### **API Response Format Changes**

**User Profile Response:**

**v7.x Response:**

```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2025-08-15T10:30:00Z"
}
```

**v8.0.0 Response:**

```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "provider": "google",
  "avatar_url": "https://avatar-url.com/image.jpg",
  "biometric_enabled": false,
  "security_risk_score": 0.1,
  "last_login": "2025-08-15T14:25:00Z",
  "created_at": "2025-08-15T10:30:00Z",
  "updated_at": "2025-08-15T14:25:00Z"
}
```

**Authentication Token Response:**

**v7.x Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

**v8.0.0 Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_expires_in": 604800,
  "scope": "read write"
}
```

### **Endpoint Changes**

| v7.x Endpoint | v8.0.0 Endpoint | Status | Notes |
|---------------|-----------------|--------|-------|
| `/api/auth/login` | `/api/auth/{provider}` | Changed | Provider-specific endpoints |
| `/api/auth/logout` | `/api/auth/logout` | Unchanged | - |
| `/api/user` | `/api/user/profile` | Changed | More specific naming |
| - | `/api/ai/security/analyze` | New | AI security analysis |
| - | `/api/websocket/connect` | New | WebSocket connection |
| - | `/api/performance/metrics` | New | Performance monitoring |

### **JavaScript SDK Changes**

**v7.x SDK:**

```javascript
const nox = new NOXAuth({
  endpoint: 'https://api.example.com'
});

const token = await nox.login('google');
const user = await nox.getUser(token);
```

**v8.0.0 SDK:**

```javascript
const client = new NOXClient({
  baseUrl: 'https://api.example.com',
  enablePerformanceMonitoring: true
});

const authUrl = await client.getAuthUrl('google', '/callback');
window.location.href = authUrl;

// After callback
const tokens = await client.exchangeCode(code, 'google');
client.setTokens(tokens);
const user = await client.getUserProfile();
```

---

## 🧪 **TESTING THE MIGRATION**

### **Pre-Migration Testing**

**Test Current v7.x Installation:**

```bash
# Test authentication flow
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"provider": "google"}'

# Test user endpoints
curl -H "Authorization: Bearer $TOKEN" \
  https://yourdomain.com/api/user
```

### **Post-Migration Testing**

**Test v8.0.0 Installation:**

```bash
# Test health endpoint
curl https://yourdomain.com/health

# Test OAuth2 URL generation
curl https://yourdomain.com/api/auth/google/url

# Test WebSocket connection
wscat -c wss://yourdomain.com/ws

# Test AI security (if enabled)
curl -X POST https://yourdomain.com/api/ai/security/analyze \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"request_data": {"ip": "192.168.1.1"}}'
```

### **Automated Testing Script**

```bash
#!/bin/bash
# migration-test.sh

echo "Testing NOX API v8.0.0 Migration..."

# Test basic connectivity
echo "Testing health endpoint..."
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" https://yourdomain.com/health)
if [ "$HEALTH" = "200" ]; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed (HTTP $HEALTH)"
    exit 1
fi

# Test OAuth endpoints
echo "Testing OAuth endpoints..."
for provider in google github microsoft; do
    URL_RESPONSE=$(curl -s https://yourdomain.com/api/auth/$provider/url)
    if echo "$URL_RESPONSE" | grep -q "url"; then
        echo "✅ $provider OAuth URL generation working"
    else
        echo "❌ $provider OAuth URL generation failed"
    fi
done

# Test database connectivity
echo "Testing database connectivity..."
DB_STATUS=$(curl -s https://yourdomain.com/health/db | jq -r '.status')
if [ "$DB_STATUS" = "ok" ]; then
    echo "✅ Database connectivity working"
else
    echo "❌ Database connectivity failed"
fi

# Test Redis connectivity
echo "Testing Redis connectivity..."
REDIS_STATUS=$(curl -s https://yourdomain.com/health/redis | jq -r '.status')
if [ "$REDIS_STATUS" = "ok" ]; then
    echo "✅ Redis connectivity working"
else
    echo "❌ Redis connectivity failed"
fi

echo "Migration testing complete!"
```

---

## 🚨 **ROLLBACK PROCEDURES**

### **Emergency Rollback**

If you encounter critical issues after migration:

#### **Quick Rollback Steps:**

```bash
# 1. Stop v8.0.0 application
sudo systemctl stop nox-api

# 2. Restore v7.x backup
cp -r /opt/nox-api-v7-backup /opt/nox-api

# 3. Restore database
pg_restore -d nox_api nox_api_v7_backup.sql

# 4. Restore environment configuration
cp /opt/nox-api/.env.v7.backup /opt/nox-api/.env

# 5. Start v7.x application
cd /opt/nox-api
npm start

# 6. Update DNS/load balancer if needed
# (Point traffic back to v7.x instance)
```

#### **Detailed Rollback Procedure:**

**Step 1: Assess the Situation**

```bash
# Check application logs
tail -f /var/log/nox-api/error.log

# Check system resources
htop
df -h

# Check database status
psql -d nox_api -c "SELECT version();"
```

**Step 2: Graceful Rollback**

```bash
# Create rollback log
echo "$(date): Starting rollback from v8.0.0 to v7.x" >> /var/log/nox-rollback.log

# Backup current v8.0.0 state (for analysis)
pg_dump nox_api > nox_api_v8_failed_$(date +%Y%m%d_%H%M%S).sql
cp -r /opt/nox-api /opt/nox-api-v8-failed-$(date +%Y%m%d_%H%M%S)

# Restore v7.x
psql -d nox_api < nox_api_v7_backup.sql
cp -r /opt/nox-api-v7-backup/* /opt/nox-api/

# Update configuration
cp /opt/nox-api/.env.v7 /opt/nox-api/.env

# Restart services
sudo systemctl restart nox-api
sudo systemctl restart nginx
sudo systemctl restart redis
```

**Step 3: Verify Rollback**

```bash
# Test v7.x functionality
./test-v7x.sh

# Check user authentication
curl -X POST https://yourdomain.com/api/auth/login \
  -d '{"provider": "google"}'

# Verify database integrity
psql -d nox_api -c "SELECT COUNT(*) FROM users;"
```

### **Common Rollback Scenarios**

#### **Scenario 1: OAuth Provider Issues**

```bash
# Symptoms: Users can't authenticate
# Quick fix: Restore v7.x OAuth configuration

# Restore OAuth redirect URLs in provider consoles
# Google Console: Remove v8.0.0 URLs, restore v7.x URLs
# GitHub Settings: Update callback URL back to v7.x format
# Microsoft Azure: Restore v7.x authentication settings
```

#### **Scenario 2: Database Migration Issues**

```bash
# Symptoms: Data corruption or missing data
# Full database restore required

dropdb nox_api
createdb nox_api
pg_restore -d nox_api nox_api_v7_backup.sql

# Verify data integrity
psql -d nox_api -c "
  SELECT table_name, 
         (xpath('/row/cnt/text()', xml_count))[1]::text::int as row_count
  FROM (
    SELECT table_name, 
           query_to_xml(format('select count(*) as cnt from %I.%I', 
                               table_schema, table_name), 
                        false, true, '') as xml_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
  ) t;
"
```

#### **Scenario 3: Performance Issues**

```bash
# Symptoms: High CPU/memory usage, slow responses
# Gradual rollback with performance monitoring

# Monitor system during rollback
watch -n 1 'ps aux | grep node'
watch -n 1 'free -m'

# Test performance after rollback
ab -n 100 -c 10 https://yourdomain.com/api/user/profile
```

---

## 📊 **MONITORING POST-MIGRATION**

### **Key Metrics to Monitor**

#### **Application Metrics**

```bash
# Monitor these metrics for 24-48 hours post-migration:

# Response times
curl -w "@curl-format.txt" -s -o /dev/null https://yourdomain.com/api/user/profile

# Error rates
grep "ERROR" /var/log/nox-api/app.log | wc -l

# Memory usage
ps -o pid,rss,vsz,comm -p $(pgrep node)

# Database connections
psql -d nox_api -c "SELECT count(*) FROM pg_stat_activity;"
```

#### **Business Metrics**

```sql
-- User authentication success rate
SELECT 
  DATE_TRUNC('hour', created_at) as hour,
  COUNT(*) as total_attempts,
  COUNT(CASE WHEN status = 'success' THEN 1 END) as successful,
  ROUND(COUNT(CASE WHEN status = 'success' THEN 1 END) * 100.0 / COUNT(*), 2) as success_rate
FROM authentication_logs 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', created_at)
ORDER BY hour;

-- New user registrations
SELECT DATE(created_at), COUNT(*) as new_users
FROM users 
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY DATE(created_at);
```

### **Alerting Setup**

**Prometheus Alerts (if using):**

```yaml
# migration-alerts.yml
groups:
- name: nox-migration-alerts
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
    for: 5m
    annotations:
      summary: "High error rate detected post-migration"

  - alert: DatabaseConnectionIssues
    expr: pg_stat_database_numbackends > 50
    for: 2m
    annotations:
      summary: "High database connection count"

  - alert: MemoryUsageHigh
    expr: process_resident_memory_bytes > 1000000000
    for: 10m
    annotations:
      summary: "Memory usage high post-migration"
```

---

## 🆘 **MIGRATION SUPPORT**

### **Getting Help During Migration**

#### **Before Migration**
- **Pre-migration consultation:** migration-support@yourdomain.com
- **Staging environment setup:** Contact support for dedicated staging instance
- **Custom migration planning:** Available for enterprise customers

#### **During Migration**
- **Emergency hotline:** +1-555-NOX-HELP (24/7 during migration window)
- **Live chat support:** https://support.yourdomain.com/chat
- **Screen sharing support:** Available via Zoom/Teams

#### **After Migration**
- **Post-migration review:** Schedule within 48 hours
- **Performance optimization:** Available as consulting service
- **Training sessions:** Available for team onboarding

### **Common Migration Issues**

#### **Issue: Migration Stuck at Database Step**

```bash
# Check migration status
npm run migration:status

# If stuck, try manual migration
psql -d nox_api -f migrations/v8.0.0-manual.sql

# Verify migration
npm run migration:verify
```

#### **Issue: OAuth Providers Not Working**

```bash
# Check redirect URLs
curl https://yourdomain.com/api/auth/google/url

# Verify provider configuration
node -e "console.log(process.env.GOOGLE_CLIENT_ID)"

# Test provider connectivity
curl https://accounts.google.com/o/oauth2/v2/auth
```

#### **Issue: Performance Problems**

```bash
# Enable debug logging
export DEBUG="nox:*"
npm start

# Monitor performance
npm run monitor:performance

# Check bundle size
npm run build:analyze
```

---

## 📝 **MIGRATION CHECKLIST**

### **Pre-Migration**
- [ ] Backup database and application files
- [ ] Test migration in staging environment
- [ ] Update OAuth provider redirect URLs
- [ ] Prepare new environment variables
- [ ] Schedule maintenance window
- [ ] Notify users of upcoming changes
- [ ] Prepare rollback procedure

### **During Migration**
- [ ] Stop v7.x application
- [ ] Run database migrations
- [ ] Deploy v8.0.0 code
- [ ] Update configuration files
- [ ] Test basic functionality
- [ ] Verify OAuth flows
- [ ] Check performance metrics
- [ ] Test AI security features (if enabled)
- [ ] Verify WebSocket connectivity
- [ ] Update monitoring/alerting

### **Post-Migration**
- [ ] Monitor application for 24 hours
- [ ] Verify user authentication success rates
- [ ] Check error logs for issues
- [ ] Validate performance improvements
- [ ] Test all OAuth providers
- [ ] Confirm AI security is working
- [ ] Verify WebSocket real-time features
- [ ] Update documentation
- [ ] Train team on new features
- [ ] Schedule post-migration review

---

## 🎉 **CONCLUSION**

Congratulations on migrating to NOX API v8.0.0! This version brings significant improvements in security, performance, and user experience. 

### **Next Steps**

1. **Explore New Features:**
   - Set up AI security monitoring
   - Enable performance optimization
   - Configure WebSocket real-time updates
   - Implement biometric authentication

2. **Optimize Your Installation:**
   - Review performance metrics
   - Set up proper monitoring
   - Configure production deployment automation
   - Implement advanced security features

3. **Join the Community:**
   - Follow our [GitHub repository](https://github.com/your-org/nox-api)
   - Join our [Discord community](https://discord.gg/nox-api)
   - Subscribe to our [newsletter](https://newsletter.yourdomain.com)

### **Support Resources**

- **Documentation:** https://docs.yourdomain.com
- **API Reference:** https://api.yourdomain.com/docs
- **Community Forum:** https://community.yourdomain.com
- **Professional Support:** support@yourdomain.com

---

**🚀 Welcome to NOX API v8.0.0! 🎯**

*The future of authentication is here - secure, fast, and intelligent.*

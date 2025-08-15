# 🔐 NOX API v8.0.0 - Authentication Setup & Troubleshooting Guide

**Version:** v8.0.0  
**Last Updated:** August 15, 2025  
**Status:** Production Ready

---

## 📋 **OVERVIEW**

This comprehensive guide covers OAuth2 setup, troubleshooting, and best practices for the NOX API v8.0.0 authentication system. Whether you're setting up a new integration or debugging existing issues, this guide provides step-by-step solutions.

---

## 🚀 **INITIAL SETUP**

### **Prerequisites**

Before starting, ensure you have:

- ✅ NOX API v8.0.0 deployed and running
- ✅ SSL/TLS certificate configured
- ✅ Domain name pointing to your NOX instance
- ✅ OAuth2 provider accounts (Google, GitHub, Microsoft)
- ✅ Development environment with HTTPS enabled

---

## 🔧 **OAUTH2 PROVIDER CONFIGURATION**

### **Google OAuth2 Setup**

#### **Step 1: Create Google Cloud Project**

1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing one
3. Enable "Google+ API" and "OAuth2 API"

#### **Step 2: Configure OAuth Consent Screen**

1. Navigate to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type (or "Internal" for G Suite)
3. Fill required information:

```
App name: Your NOX Application
User support email: support@yourdomain.com
Developer contact: developer@yourdomain.com
Authorized domains: yourdomain.com
```

#### **Step 3: Create OAuth2 Credentials**

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Configure redirect URIs:

```
Authorized JavaScript origins:
https://yourdomain.com

Authorized redirect URIs:
https://yourdomain.com/api/auth/google/callback
https://yourdomain.com/auth/callback
```

#### **Step 4: Update NOX Configuration**

Add to your `.env` file:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
```

#### **Common Google OAuth Issues**

**Issue:** "redirect_uri_mismatch"

```
Solution:
1. Verify redirect URI exactly matches Google Console
2. Ensure HTTPS is used in production
3. Check for trailing slashes
```

**Issue:** "access_denied"

```
Solution:
1. Check OAuth consent screen approval status
2. Verify app domain authorization
3. Ensure required scopes are requested
```

### **GitHub OAuth2 Setup**

#### **Step 1: Create GitHub OAuth App**

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill application details:

```
Application name: Your NOX Application
Homepage URL: https://yourdomain.com
Authorization callback URL: https://yourdomain.com/api/auth/github/callback
```

#### **Step 2: Configure NOX**

Add to your `.env` file:

```env
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=https://yourdomain.com/api/auth/github/callback
```

#### **Common GitHub OAuth Issues**

**Issue:** "The redirect_uri MUST match the registered callback URL"

```
Solution:
1. Exact match required (case-sensitive)
2. No query parameters allowed in registered URL
3. Protocol (https://) must match
```

**Issue:** "Application suspended"

```
Solution:
1. Check GitHub app status
2. Verify terms of service compliance
3. Contact GitHub support if needed
```

### **Microsoft OAuth2 Setup**

#### **Step 1: Register Azure AD Application**

1. Visit [Azure Portal](https://portal.azure.com)
2. Navigate to "Azure Active Directory" → "App registrations"
3. Click "New registration"
4. Configure application:

```
Name: Your NOX Application
Supported account types: Accounts in any organizational directory and personal Microsoft accounts
Redirect URI: https://yourdomain.com/api/auth/microsoft/callback
```

#### **Step 2: Configure Authentication**

1. In app registration, go to "Authentication"
2. Add redirect URIs:

```
Web:
https://yourdomain.com/api/auth/microsoft/callback
https://yourdomain.com/auth/callback
```

3. Enable "ID tokens" and "Access tokens"

#### **Step 3: Create Client Secret**

1. Go to "Certificates & secrets"
2. Click "New client secret"
3. Set expiration period (recommended: 24 months)
4. Save the secret value

#### **Step 4: Configure NOX**

Add to your `.env` file:

```env
MICROSOFT_CLIENT_ID=your-azure-app-id
MICROSOFT_CLIENT_SECRET=your-client-secret
MICROSOFT_REDIRECT_URI=https://yourdomain.com/api/auth/microsoft/callback
MICROSOFT_TENANT_ID=common
```

#### **Common Microsoft OAuth Issues**

**Issue:** "AADSTS50011: The reply URL specified in the request does not match"

```
Solution:
1. Verify redirect URI in Azure portal
2. Check for URL encoding issues
3. Ensure HTTPS is used
```

**Issue:** "AADSTS700016: Application not found"

```
Solution:
1. Check client_id is correct
2. Verify application is in correct tenant
3. Ensure application is not deleted
```

---

## 🔍 **TROUBLESHOOTING GUIDE**

### **Common Authentication Flows Issues**

#### **Issue 1: OAuth State Mismatch**

**Symptoms:**
```
Error: "invalid_request: state parameter mismatch"
```

**Diagnosis:**
```javascript
// Check state parameter handling
console.log('Generated state:', generatedState);
console.log('Received state:', receivedState);
```

**Solutions:**
1. **Store state properly:**

```javascript
// Store state in session or secure cookie
const state = generateRandomString(32);
sessionStorage.setItem('oauth_state', state);

// Verify on callback
const storedState = sessionStorage.getItem('oauth_state');
if (storedState !== receivedState) {
  throw new Error('State mismatch - potential CSRF attack');
}
```

2. **Handle state expiration:**

```javascript
// Add timestamp to state
const state = JSON.stringify({
  value: generateRandomString(32),
  timestamp: Date.now()
});

// Verify with timeout
const parsedState = JSON.parse(storedState);
const isExpired = Date.now() - parsedState.timestamp > 300000; // 5 minutes
```

#### **Issue 2: Token Exchange Failures**

**Symptoms:**
```
Error: "invalid_grant: authorization code expired"
```

**Diagnosis:**
```javascript
// Log token exchange details
console.log('Authorization code:', code);
console.log('Code length:', code.length);
console.log('Time since callback:', Date.now() - callbackTime);
```

**Solutions:**
1. **Implement immediate exchange:**

```javascript
// Exchange code immediately on callback
window.addEventListener('load', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  
  if (code) {
    try {
      const tokens = await exchangeCodeForTokens(code);
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error('Token exchange failed:', error);
    }
  }
});
```

2. **Handle expired codes:**

```javascript
async function exchangeCodeWithRetry(code, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await exchangeCodeForTokens(code);
    } catch (error) {
      if (error.message.includes('expired') && i < maxRetries - 1) {
        // Restart OAuth flow
        return startOAuthFlow();
      }
      throw error;
    }
  }
}
```

#### **Issue 3: CORS and Domain Issues**

**Symptoms:**
```
CORS error: "Access to fetch blocked by CORS policy"
```

**Diagnosis:**
```javascript
// Check if running on correct domain
console.log('Current origin:', window.location.origin);
console.log('Expected origin:', 'https://yourdomain.com');

// Check if HTTPS is enabled
console.log('Is HTTPS:', window.location.protocol === 'https:');
```

**Solutions:**
1. **Configure CORS properly:**

```javascript
// In your NOX API configuration
const corsOptions = {
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
    // Add development origins if needed
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Authorization', 'Content-Type']
};
```

2. **Handle development environment:**

```javascript
// Development proxy configuration
const devProxy = {
  '/api/*': {
    target: 'https://yourdomain.com',
    secure: true,
    changeOrigin: true,
    cookieDomainRewrite: 'localhost'
  }
};
```

### **Advanced Troubleshooting**

#### **Token Refresh Issues**

**Issue:** Refresh tokens not working

**Diagnosis:**
```javascript
// Check refresh token validity
const refreshToken = getStoredRefreshToken();
console.log('Refresh token exists:', !!refreshToken);
console.log('Token format valid:', isValidJWT(refreshToken));

// Check token expiry
const decodedToken = decodeJWT(accessToken);
console.log('Access token expires:', new Date(decodedToken.exp * 1000));
console.log('Current time:', new Date());
```

**Solutions:**
```javascript
// Implement automatic refresh with retry logic
class TokenManager {
  constructor() {
    this.refreshPromise = null;
  }

  async getValidToken() {
    const token = this.getAccessToken();
    
    if (!token || this.isTokenExpired(token)) {
      // Prevent multiple refresh attempts
      if (!this.refreshPromise) {
        this.refreshPromise = this.refreshTokens();
      }
      
      try {
        await this.refreshPromise;
        this.refreshPromise = null;
        return this.getAccessToken();
      } catch (error) {
        this.refreshPromise = null;
        // Redirect to login if refresh fails
        this.redirectToLogin();
        throw error;
      }
    }
    
    return token;
  }

  async refreshTokens() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const tokens = await response.json();
    this.storeTokens(tokens);
  }
}
```

#### **Session Management Issues**

**Issue:** Users getting logged out unexpectedly

**Diagnosis:**
```javascript
// Monitor session events
window.addEventListener('storage', (e) => {
  if (e.key === 'nox_token' && !e.newValue) {
    console.log('Token removed from storage');
    handleLogout();
  }
});

// Check for multiple tabs
const sessionId = generateSessionId();
localStorage.setItem('session_id', sessionId);

setInterval(() => {
  const currentSessionId = localStorage.getItem('session_id');
  if (currentSessionId !== sessionId) {
    console.log('Multiple sessions detected');
  }
}, 1000);
```

**Solutions:**
```javascript
// Implement proper session management
class SessionManager {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupEventListeners();
    this.startHeartbeat();
  }

  setupEventListeners() {
    // Handle tab visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.validateSession();
      }
    });

    // Handle storage events (for multi-tab sync)
    window.addEventListener('storage', (e) => {
      if (e.key === 'nox_session_action') {
        this.handleSessionAction(JSON.parse(e.newValue));
      }
    });
  }

  startHeartbeat() {
    setInterval(async () => {
      try {
        await this.pingSession();
      } catch (error) {
        console.error('Session heartbeat failed:', error);
        this.handleSessionExpired();
      }
    }, 60000); // Check every minute
  }

  broadcastAction(action, data = {}) {
    localStorage.setItem('nox_session_action', JSON.stringify({
      action,
      data,
      timestamp: Date.now(),
      sessionId: this.sessionId
    }));
    
    // Clear the item after broadcasting
    setTimeout(() => {
      localStorage.removeItem('nox_session_action');
    }, 100);
  }
}
```

---

## 🔒 **SECURITY BEST PRACTICES**

### **Token Security**

#### **Secure Token Storage**

```javascript
// Use httpOnly cookies for sensitive tokens
class SecureTokenStorage {
  static setTokens(tokens) {
    // Access token in memory only (for short-lived tokens)
    this.memoryTokens = {
      access_token: tokens.access_token,
      expires_at: Date.now() + (tokens.expires_in * 1000)
    };

    // Refresh token in httpOnly cookie
    document.cookie = `refresh_token=${tokens.refresh_token}; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=${tokens.refresh_expires_in}`;
  }

  static getAccessToken() {
    if (!this.memoryTokens || Date.now() >= this.memoryTokens.expires_at) {
      return null;
    }
    return this.memoryTokens.access_token;
  }

  static clearTokens() {
    this.memoryTokens = null;
    document.cookie = 'refresh_token=; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=0';
  }
}
```

#### **CSRF Protection**

```javascript
// Generate and validate CSRF tokens
class CSRFProtection {
  static generateToken() {
    const token = crypto.getRandomValues(new Uint8Array(32))
      .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
    
    sessionStorage.setItem('csrf_token', token);
    return token;
  }

  static validateToken(receivedToken) {
    const storedToken = sessionStorage.getItem('csrf_token');
    return storedToken && storedToken === receivedToken;
  }

  static addToRequest(config) {
    const token = this.generateToken();
    config.headers = {
      ...config.headers,
      'X-CSRF-Token': token
    };
    return config;
  }
}
```

### **Input Validation**

#### **Client-Side Validation**

```javascript
// Validate OAuth parameters
function validateOAuthCallback(params) {
  const { code, state, error } = params;

  // Check for OAuth errors
  if (error) {
    throw new OAuthError(error, params.error_description);
  }

  // Validate authorization code
  if (!code || typeof code !== 'string' || code.length < 10) {
    throw new ValidationError('Invalid authorization code');
  }

  // Validate state parameter
  if (!state || typeof state !== 'string') {
    throw new ValidationError('Missing state parameter');
  }

  // Check state format
  const storedState = sessionStorage.getItem('oauth_state');
  if (state !== storedState) {
    throw new SecurityError('State parameter mismatch - possible CSRF attack');
  }

  return { code, state };
}
```

#### **Server-Side Validation**

```javascript
// Validate tokens and claims
function validateAccessToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check required claims
    const requiredClaims = ['sub', 'aud', 'exp', 'iat'];
    for (const claim of requiredClaims) {
      if (!(claim in decoded)) {
        throw new Error(`Missing required claim: ${claim}`);
      }
    }

    // Validate audience
    if (decoded.aud !== process.env.OAUTH_AUDIENCE) {
      throw new Error('Invalid audience');
    }

    // Check expiration
    if (decoded.exp <= Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired');
    }

    return decoded;
  } catch (error) {
    throw new AuthenticationError('Invalid token: ' + error.message);
  }
}
```

---

## 🧪 **TESTING AUTHENTICATION**

### **Automated Testing**

#### **OAuth Flow Testing**

```javascript
// Test complete OAuth flow
describe('OAuth Authentication', () => {
  test('should complete Google OAuth flow', async () => {
    // Mock OAuth provider responses
    const mockResponses = {
      '/oauth2/authorize': { code: 'mock_code', state: 'mock_state' },
      '/oauth2/token': {
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
        expires_in: 3600
      }
    };

    // Start OAuth flow
    const authUrl = await noxClient.getAuthUrl('google', 'http://localhost/callback');
    expect(authUrl).toContain('accounts.google.com');

    // Mock callback
    const tokens = await noxClient.exchangeCode('mock_code', 'google');
    expect(tokens).toHaveProperty('access_token');
    expect(tokens).toHaveProperty('refresh_token');

    // Test token usage
    const profile = await noxClient.getUserProfile();
    expect(profile).toHaveProperty('email');
  });

  test('should handle OAuth errors', async () => {
    // Test error scenarios
    await expect(noxClient.exchangeCode('invalid_code', 'google'))
      .rejects.toThrow('invalid_grant');

    await expect(noxClient.exchangeCode('', 'google'))
      .rejects.toThrow('ValidationError');
  });
});
```

#### **Token Management Testing**

```javascript
// Test token lifecycle
describe('Token Management', () => {
  test('should refresh expired tokens', async () => {
    // Set up expired token
    const expiredToken = generateJWT({ exp: Date.now() / 1000 - 100 });
    noxClient.setAccessToken(expiredToken);

    // Should automatically refresh
    const profile = await noxClient.getUserProfile();
    expect(profile).toBeDefined();

    // Should have new token
    const newToken = noxClient.getAccessToken();
    expect(newToken).not.toBe(expiredToken);
  });

  test('should handle refresh failures', async () => {
    // Set up invalid refresh token
    noxClient.setRefreshToken('invalid_refresh_token');
    noxClient.setAccessToken(generateExpiredToken());

    // Should redirect to login
    await expect(noxClient.getUserProfile())
      .rejects.toThrow('Authentication required');
  });
});
```

### **Manual Testing Checklist**

#### **OAuth Provider Testing**

**Google OAuth:**
- [ ] Authorization URL redirects correctly
- [ ] User can grant/deny permissions
- [ ] Callback includes authorization code
- [ ] Token exchange returns valid tokens
- [ ] Profile API returns user data
- [ ] Refresh tokens work correctly

**GitHub OAuth:**
- [ ] App authorization screen displays
- [ ] Scope permissions are correct
- [ ] Private email access works (if requested)
- [ ] Organization access works (if applicable)

**Microsoft OAuth:**
- [ ] Microsoft login screen displays
- [ ] Both personal and work accounts work
- [ ] Multi-factor authentication flows work
- [ ] Tenant-specific login works

#### **Security Testing**

**CSRF Protection:**
- [ ] State parameter generated and validated
- [ ] Invalid state parameter rejected
- [ ] Cross-origin requests blocked
- [ ] Session fixation prevented

**Token Security:**
- [ ] Tokens stored securely
- [ ] Expired tokens handled properly
- [ ] Token revocation works
- [ ] Multiple session handling

---

## 🚨 **EMERGENCY PROCEDURES**

### **Security Incidents**

#### **Compromised OAuth App**

**Immediate Actions:**
1. **Revoke OAuth credentials:**

```bash
# Disable OAuth app in provider console
# Google: Cloud Console → Credentials
# GitHub: Settings → Developer settings → OAuth Apps
# Microsoft: Azure Portal → App registrations
```

2. **Update application credentials:**

```bash
# Generate new client secret
# Update environment variables
export GOOGLE_CLIENT_SECRET="new-secret"
export GITHUB_CLIENT_SECRET="new-secret"
export MICROSOFT_CLIENT_SECRET="new-secret"

# Restart application
sudo systemctl restart nox-api
```

3. **Force user re-authentication:**

```javascript
// Invalidate all sessions
await revokeAllUserSessions();

// Clear stored tokens
await clearAllStoredTokens();

// Notify users
await sendSecurityNotification({
  subject: 'Security Update - Please Log In Again',
  message: 'For security reasons, please log in again to your account.'
});
```

#### **Token Leakage**

**Detection:**
```javascript
// Monitor for suspicious token usage
function detectAnomalousActivity(token, request) {
  const analysis = {
    unusual_location: isUnusualLocation(request.ip),
    rapid_requests: isRapidFireRequests(token, request.timestamp),
    unusual_user_agent: isUnusualUserAgent(request.user_agent),
    suspicious_patterns: detectSuspiciousPatterns(request)
  };

  if (Object.values(analysis).some(Boolean)) {
    triggerSecurityAlert(token, analysis);
  }
}
```

**Response:**
```javascript
// Immediate token revocation
async function handleTokenLeakage(suspiciousTokens) {
  for (const token of suspiciousTokens) {
    // Revoke token
    await revokeToken(token);
    
    // Notify affected user
    const userId = extractUserIdFromToken(token);
    await notifyUser(userId, 'suspicious_activity');
    
    // Log security event
    await logSecurityEvent({
      type: 'token_revocation',
      token_id: token.id,
      reason: 'suspicious_activity',
      timestamp: Date.now()
    });
  }
}
```

### **Service Recovery**

#### **OAuth Provider Outage**

**Fallback Strategy:**
```javascript
// Implement provider fallback
class MultiProviderAuth {
  constructor() {
    this.providers = ['google', 'github', 'microsoft'];
    this.healthStatus = new Map();
  }

  async checkProviderHealth(provider) {
    try {
      const response = await fetch(`/api/auth/${provider}/health`, {
        timeout: 5000
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async getAvailableProviders() {
    const checks = await Promise.all(
      this.providers.map(async provider => ({
        provider,
        available: await this.checkProviderHealth(provider)
      }))
    );

    return checks.filter(check => check.available);
  }

  async authenticateWithFallback(preferredProvider) {
    const available = await this.getAvailableProviders();
    
    if (available.some(p => p.provider === preferredProvider)) {
      return this.authenticate(preferredProvider);
    }

    // Use first available provider
    if (available.length > 0) {
      return this.authenticate(available[0].provider);
    }

    throw new Error('No authentication providers available');
  }
}
```

#### **Database Connection Issues**

**Session Recovery:**
```javascript
// Implement session persistence fallback
class SessionFallback {
  constructor() {
    this.memoryStore = new Map();
    this.redisStore = redis.createClient();
    this.fileStore = './sessions';
  }

  async getSession(sessionId) {
    // Try memory first (fastest)
    if (this.memoryStore.has(sessionId)) {
      return this.memoryStore.get(sessionId);
    }

    // Try Redis
    try {
      const session = await this.redisStore.get(`session:${sessionId}`);
      if (session) {
        const parsed = JSON.parse(session);
        this.memoryStore.set(sessionId, parsed); // Cache in memory
        return parsed;
      }
    } catch (error) {
      console.error('Redis unavailable:', error.message);
    }

    // Try file store
    try {
      const sessionFile = path.join(this.fileStore, `${sessionId}.json`);
      if (fs.existsSync(sessionFile)) {
        const session = JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
        this.memoryStore.set(sessionId, session);
        return session;
      }
    } catch (error) {
      console.error('File store unavailable:', error.message);
    }

    return null;
  }
}
```

---

## 📞 **SUPPORT CONTACTS**

### **Getting Help**

**Technical Support:**
- **Documentation:** https://your-nox-domain.com/docs/auth
- **GitHub Issues:** https://github.com/your-org/nox-api/issues
- **Email:** auth-support@yourdomain.com
- **Discord:** https://discord.gg/nox-api

**OAuth Provider Support:**
- **Google:** https://developers.google.com/identity/protocols/oauth2
- **GitHub:** https://docs.github.com/en/developers/apps/building-oauth-apps
- **Microsoft:** https://docs.microsoft.com/en-us/azure/active-directory/develop/

### **Escalation Procedures**

**Severity Levels:**

**P1 - Critical (Authentication completely broken):**
- Contact: auth-emergency@yourdomain.com
- Response time: 1 hour
- Include: Error logs, affected user count, business impact

**P2 - High (Partial authentication failures):**
- Contact: auth-support@yourdomain.com
- Response time: 4 hours
- Include: Affected providers, error rates, reproduction steps

**P3 - Medium (Performance or usability issues):**
- Contact: auth-support@yourdomain.com
- Response time: 24 hours
- Include: Performance metrics, user feedback, suggested improvements

**P4 - Low (Enhancement requests):**
- Create GitHub issue or contact support
- Response time: Best effort

---

## 📚 **ADDITIONAL RESOURCES**

### **OAuth2 Specification References**

- [RFC 6749 - OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749)
- [RFC 6750 - Bearer Token Usage](https://tools.ietf.org/html/rfc6750)
- [RFC 7636 - PKCE](https://tools.ietf.org/html/rfc7636)
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)

### **Security Guidelines**

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OAuth 2.0 Security Best Practices](https://tools.ietf.org/html/draft-ietf-oauth-security-topics)
- [NIST Digital Identity Guidelines](https://pages.nist.gov/800-63-3/)

### **Testing Tools**

- [OAuth 2.0 Debugger](https://oauthdebugger.com/)
- [JWT.io Debugger](https://jwt.io/)
- [Postman OAuth 2.0 Testing](https://learning.postman.com/docs/sending-requests/authorization/#oauth-20)

---

**🔒 Secure authentication with NOX API v8.0.0! 🚀**

For the latest security updates and best practices, subscribe to our [security newsletter](https://your-nox-domain.com/security/subscribe) and follow our [security blog](https://your-nox-domain.com/blog/security).

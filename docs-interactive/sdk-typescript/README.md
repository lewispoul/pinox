# NOX API TypeScript SDK

Official TypeScript SDK for NOX API v8.0.0 with AI-enhanced features, multi-node support, and seamless integration with IAM 2.0 authentication system.

## Features

- 🚀 **Full TypeScript Support** - Complete type safety and IntelliSense
- 🤖 **AI-Enhanced APIs** - Built-in AI analysis and prediction methods
- 🔐 **IAM 2.0 Integration** - Seamless authentication and token management
- 🌐 **Multi-Node Support** - Automatic load balancing and health monitoring
- ⚡ **Real-time WebSocket** - Streaming metrics and real-time updates
- 🔄 **Auto-Retry Logic** - Intelligent request retry with exponential backoff
- 📊 **Performance Monitoring** - Built-in request timing and metrics
- 🛠️ **Extensible Design** - Easy to customize and extend

## Installation

```bash
npm install @nox/api-sdk
```

For GitHub Packages (recommended for enterprise):

```bash
npm config set @nox:registry https://npm.pkg.github.com
npm install @nox/api-sdk
```

## Quick Start

```typescript
import { NoxClient, createNoxClient } from '@nox/api-sdk';

// Basic setup
const client = createNoxClient({
  apiUrl: 'https://api.nox.ai',
  token: 'your-jwt-token'
});

// With WebSocket support for real-time features
const client = new NoxClient({
  apiUrl: 'https://api.nox.ai',
  enableWebSocket: true,
  wsUrl: 'wss://ws.nox.ai',
  token: 'your-jwt-token'
});

// Test connection
const isConnected = await client.testConnection();
console.log('Connected:', isConnected);
```

## Authentication

### Login and Token Management

```typescript
// Login with credentials
const auth = await client.login({
  username: 'your-username',
  password: 'your-password'
});

console.log('Access Token:', auth.token);
console.log('Expires In:', auth.expiresIn);

// Refresh token when needed
const newAuth = await client.refreshToken(auth.refreshToken!);

// Logout
await client.logout();
```

### Manual Token Setting

```typescript
// Set token manually (useful for server-side applications)
client.setToken('your-jwt-token');

// Get current config
const config = client.getConfig();
console.log('Current token:', config.token);
```

## Core API Methods

### HTTP Operations

```typescript
// GET request with type safety
interface User {
  id: string;
  name: string;
  email: string;
}

const response = await client.get<User>('/users/123');
console.log('User:', response.data);

// POST with data
const newUser = await client.post<User>('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// PUT, PATCH, DELETE
await client.put('/users/123', userData);
await client.patch('/users/123', partialData);
await client.delete('/users/123');
```

### Health and Monitoring

```typescript
// Check API health
const health = await client.getHealth();
console.log('API Status:', health.status);

// Get node information
const nodes = await client.getNodes();
nodes.forEach(node => {
  console.log(`Node ${node.id}: ${node.status} (load: ${node.load})`);
});

// Get performance metrics
const metrics = await client.getMetrics();
console.log('Response time:', metrics.responseTime);
console.log('Error rate:', metrics.errors);
```

## AI-Enhanced Features

### AI Analysis

```typescript
// Analyze data with AI
const analysis = await client.aiAnalyze({
  text: "Sample text to analyze",
  context: "customer feedback"
}, {
  model: 'gpt-4',
  confidence: 0.8
});

console.log('Confidence:', analysis.confidence);
console.log('Result:', analysis.result);
console.log('Recommendations:', analysis.recommendations);
```

### AI Predictions

```typescript
// Make predictions with trained models
const prediction = await client.aiPredict({
  features: [1.2, 3.4, 5.6],
  metadata: { userId: '123' }
}, 'model-id-123');

console.log('Prediction:', prediction);
```

## Real-Time Features

### WebSocket Streaming

```typescript
// Stream real-time metrics
const unsubscribe = client.streamMetrics((metrics) => {
  console.log('Real-time metrics:', metrics);
  console.log('CPU:', metrics.cpu, '%');
  console.log('Memory:', metrics.memory, 'MB');
});

// Unsubscribe when done
setTimeout(() => {
  unsubscribe();
}, 60000); // Stop after 1 minute
```

### Custom WebSocket Events

```typescript
// Listen for custom events
client.on('ws:alert', (alert) => {
  console.log('Alert received:', alert);
});

client.on('ws:ai_result', (result) => {
  console.log('AI result:', result);
});

// Remove listeners
client.off('ws:alert');
```

## Job Queue Integration

```typescript
// Submit background jobs
const job = await client.submitJob('data-processing', {
  dataset: 'user-analytics-2024',
  parameters: { threshold: 0.95 }
});

console.log('Job ID:', job.jobId);

// Check job status
const status = await client.getJobStatus(job.jobId);
console.log('Status:', status.status);

if (status.result) {
  console.log('Result:', status.result);
}
```

## Error Handling

```typescript
try {
  const response = await client.get('/protected-endpoint');
  console.log(response.data);
} catch (error) {
  if (error.response?.status === 401) {
    console.log('Authentication required');
    // Handle auth error
  } else if (error.response?.status >= 500) {
    console.log('Server error, retrying...');
    // SDK automatically retries, but you can handle it here
  } else {
    console.error('Request failed:', error.message);
  }
}
```

## Advanced Configuration

```typescript
const client = new NoxClient({
  apiUrl: 'https://api.nox.ai',
  token: 'your-token',
  timeout: 15000, // 15 second timeout
  retryAttempts: 5, // Retry failed requests 5 times
  enableWebSocket: true,
  wsUrl: 'wss://ws.nox.ai'
});

// Get SDK version
console.log('SDK Version:', NoxClient.getVersion()); // "8.0.0"
```

## IAM 2.0 Integration

This SDK is designed to work seamlessly with NOX IAM 2.0 following the integration strategy outlined in `CONNECTING_NOX_IAM.md`. Key integration points:

- **GitHub Packages Distribution**: Published as `@nox/api-sdk` on GitHub Packages
- **Versioned API Contracts**: Full TypeScript interfaces for all API endpoints
- **Token Management**: Automatic JWT token handling and refresh
- **Multi-Node Awareness**: Built-in support for distributed NOX deployments

## Error Codes

| Code | Description | Action |
|------|-------------|--------|
| 401 | Unauthorized | Check token validity, re-authenticate |
| 403 | Forbidden | Verify user permissions |
| 429 | Rate Limited | SDK automatically handles with backoff |
| 500+ | Server Error | SDK automatically retries with exponential backoff |

## Contributing

This SDK is part of the NOX API v8.0.0 ecosystem. For issues and contributions:

1. Check existing issues on GitHub
2. Follow TypeScript best practices
3. Add tests for new features
4. Update documentation

## License

MIT © NOX AI Team

## Support

- 📧 Email: sdk-support@nox.ai
- 📖 Documentation: https://docs.nox.ai/sdk/typescript
- 🐛 Issues: https://github.com/nox-ai/api-sdk/issues
- 💬 Community: https://community.nox.ai

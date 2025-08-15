// NOX API v8.0.0 Load Testing Script
// k6 Performance and Load Testing Suite

import { check, group, sleep } from 'k6';
import http from 'k6/http';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('error_rate');
const apiResponseTime = new Trend('api_response_time', true);
const authSuccessRate = new Rate('auth_success_rate');
const scientificComputeTime = new Trend('scientific_compute_time', true);

// Configuration
const BASE_URL = __ENV.BASE_URL || 'https://staging-api.yourdomain.com';
const TEST_USER_TOKEN = __ENV.TEST_USER_TOKEN || '';

// Test stages configuration
export let options = {
  stages: [
    // Warm-up phase
    { duration: '2m', target: 10 },   // Ramp up to 10 users
    
    // Load testing phases
    { duration: '5m', target: 100 },  // Normal load - 100 concurrent users
    { duration: '5m', target: 500 },  // High load - 500 concurrent users  
    { duration: '10m', target: 1000 }, // Peak load - 1000 concurrent users
    { duration: '5m', target: 1500 },  // Stress test - 1500 concurrent users
    
    // Cool-down phase
    { duration: '5m', target: 100 },   // Scale down to normal
    { duration: '2m', target: 0 },     // Ramp down
  ],
  
  // Performance thresholds - tests will fail if not met
  thresholds: {
    // Response time requirements
    'http_req_duration': [
      'p(95)<300',        // 95% of requests must be below 300ms
      'p(99)<500',        // 99% of requests must be below 500ms
    ],
    
    // Error rate requirements  
    'http_req_failed': [
      'rate<0.05',        // Error rate must be below 5%
    ],
    
    // Custom metric thresholds
    'error_rate': ['rate<0.02'],           // Custom error tracking
    'auth_success_rate': ['rate>0.98'],    // Auth must succeed 98% of time
    'api_response_time': ['p(95)<300'],    // API-specific response times
    'scientific_compute_time': ['p(95)<2000'], // Scientific endpoints can be slower
  },
  
  // Additional configuration
  discardResponseBodies: true,  // Save memory during load test
  noVUConnectionReuse: false,   // Reuse connections for efficiency
};

// Test data sets
const testMolecules = [
  { smiles: 'CCO', name: 'ethanol' },
  { smiles: 'CC(C)O', name: 'isopropanol' },
  { smiles: 'c1ccccc1', name: 'benzene' },
  { smiles: 'CCc1ccccc1', name: 'ethylbenzene' },
];

const testCompositions = [
  { composition: 'C2H6N6O6', density: 1.77, name: 'RDX' },
  { composition: 'C3H6N6O6', density: 1.80, name: 'TNT' },
  { composition: 'C4H8N8O8', density: 1.91, name: 'HMX' },
];

// Utility functions
function selectRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function makeAuthenticatedRequest(url, method = 'GET', payload = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (TEST_USER_TOKEN) {
    headers['Authorization'] = `Bearer ${TEST_USER_TOKEN}`;
  }
  
  const params = {
    headers: headers,
    timeout: '30s', // Reasonable timeout for scientific computations
  };
  
  let response;
  const startTime = Date.now();
  
  if (method === 'POST' && payload) {
    response = http.post(url, JSON.stringify(payload), params);
  } else {
    response = http.get(url, params);
  }
  
  const responseTime = Date.now() - startTime;
  apiResponseTime.add(responseTime);
  
  // Track error rates
  const isError = response.status >= 400;
  errorRate.add(isError);
  
  return response;
}

// Test scenarios
export default function() {
  // Distribute load across different test scenarios
  const scenario = Math.random();
  
  if (scenario < 0.3) {
    healthAndStatusChecks();
  } else if (scenario < 0.5) {
    authenticationFlow();
  } else if (scenario < 0.7) {
    scientificComputations();
  } else if (scenario < 0.9) {
    dataRetrievalOperations();
  } else {
    webSocketConnections();
  }
  
  // Add realistic user behavior delay
  sleep(Math.random() * 3 + 1); // 1-4 second pause between requests
}

function healthAndStatusChecks() {
  group('Health and Status Checks', function() {
    
    // Health check
    let response = makeAuthenticatedRequest(`${BASE_URL}/health`);
    check(response, {
      'health endpoint returns 200': (r) => r.status === 200,
      'health response contains status': (r) => r.body.includes('healthy') || r.body.includes('status'),
    });
    
    // Version check
    response = makeAuthenticatedRequest(`${BASE_URL}/version`);
    check(response, {
      'version endpoint returns 200': (r) => r.status === 200,
      'version contains 8.0.0': (r) => r.body.includes('8.0.0'),
    });
    
    // Readiness check
    response = makeAuthenticatedRequest(`${BASE_URL}/ready`);
    check(response, {
      'ready endpoint accessible': (r) => r.status === 200 || r.status === 503,
    });
    
  });
}

function authenticationFlow() {
  group('Authentication Flow', function() {
    
    const providers = ['google', 'github', 'microsoft'];
    const provider = selectRandomElement(providers);
    
    // Get OAuth URL
    let response = makeAuthenticatedRequest(`${BASE_URL}/api/auth/${provider}/url`);
    const authSuccess = check(response, {
      'auth URL generation successful': (r) => r.status === 200,
      'auth URL contains oauth': (r) => r.body.includes('oauth') || r.body.includes('authorize'),
    });
    
    authSuccessRate.add(authSuccess);
    
    // Test token validation (if token available)
    if (TEST_USER_TOKEN) {
      response = makeAuthenticatedRequest(`${BASE_URL}/api/user/profile`);
      check(response, {
        'profile endpoint with token': (r) => r.status === 200 || r.status === 401,
      });
    }
    
  });
}

function scientificComputations() {
  group('Scientific Computations', function() {
    
    const computationType = Math.random();
    const startTime = Date.now();
    
    let response;
    
    if (computationType < 0.25) {
      // XTB quantum calculations
      const molecule = selectRandomElement(testMolecules);
      response = makeAuthenticatedRequest(`${BASE_URL}/xtb/v1`, 'POST', {
        molecule: molecule.smiles,
        method: 'GFN2-xTB',
        properties: ['energy', 'forces']
      });
      
      check(response, {
        'XTB computation returns valid response': (r) => r.status === 200 || r.status === 202,
      });
      
    } else if (computationType < 0.5) {
      // Psi4 quantum chemistry
      response = makeAuthenticatedRequest(`${BASE_URL}/psi4/v1`, 'POST', {
        geometry: 'H2O',
        method: 'HF',
        basis: 'cc-pVDZ'
      });
      
      check(response, {
        'Psi4 computation accepted': (r) => r.status === 200 || r.status === 202,
      });
      
    } else if (computationType < 0.75) {
      // Empirical property prediction
      const molecule = selectRandomElement(testMolecules);
      response = makeAuthenticatedRequest(`${BASE_URL}/empirical/v1`, 'POST', {
        smiles: molecule.smiles,
        property: 'boiling_point'
      });
      
      check(response, {
        'Empirical prediction successful': (r) => r.status === 200,
      });
      
    } else {
      // CJ detonation prediction
      const composition = selectRandomElement(testCompositions);
      response = makeAuthenticatedRequest(`${BASE_URL}/predict/cj/v1`, 'POST', {
        composition: composition.composition,
        density: composition.density
      });
      
      check(response, {
        'CJ prediction successful': (r) => r.status === 200,
      });
    }
    
    const computeTime = Date.now() - startTime;
    scientificComputeTime.add(computeTime);
    
  });
}

function dataRetrievalOperations() {
  group('Data Retrieval', function() {
    
    // User data operations
    if (TEST_USER_TOKEN) {
      let response = makeAuthenticatedRequest(`${BASE_URL}/api/user/history`);
      check(response, {
        'user history accessible': (r) => r.status === 200 || r.status === 404,
      });
      
      response = makeAuthenticatedRequest(`${BASE_URL}/api/user/settings`);
      check(response, {
        'user settings accessible': (r) => r.status === 200,
      });
    }
    
    // Public data endpoints
    let response = makeAuthenticatedRequest(`${BASE_URL}/api/public/stats`);
    check(response, {
      'public stats available': (r) => r.status === 200,
    });
    
  });
}

function webSocketConnections() {
  group('WebSocket Connections', function() {
    
    // Test WebSocket endpoint availability
    // Note: k6 has limited WebSocket support, so we test the HTTP upgrade
    let response = http.get(`${BASE_URL}/ws`, {
      headers: {
        'Connection': 'Upgrade',
        'Upgrade': 'websocket',
        'Sec-WebSocket-Version': '13',
        'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ==',
      },
    });
    
    check(response, {
      'WebSocket upgrade attempt': (r) => r.status === 101 || r.status === 400 || r.status === 404,
    });
    
  });
}

// Setup function - runs once before the test
export function setup() {
  console.log(`🚀 Starting NOX API v8.0.0 Load Test`);
  console.log(`📊 Target URL: ${BASE_URL}`);
  console.log(`👥 Test will ramp up to 1500 concurrent users`);
  console.log(`⏱️  Total test duration: ~34 minutes`);
  console.log(`🎯 Performance targets:`);
  console.log(`   - 95% requests < 300ms`);
  console.log(`   - Error rate < 5%`);
  console.log(`   - Auth success > 98%`);
  console.log('');
  
  // Verify baseline connectivity
  const healthCheck = http.get(`${BASE_URL}/health`);
  if (healthCheck.status !== 200) {
    console.error(`❌ Baseline health check failed: ${healthCheck.status}`);
    console.error('Cannot proceed with load test');
    return null;
  }
  
  console.log('✅ Baseline health check passed');
  return { baselineHealthy: true };
}

// Teardown function - runs once after the test
export function teardown(data) {
  if (data && data.baselineHealthy) {
    console.log('');
    console.log('🏁 NOX API v8.0.0 Load Test Completed');
    console.log('📈 Check the summary report for detailed metrics');
    console.log('🔍 Review any threshold failures above');
    
    // Final health check
    const finalHealth = http.get(`${BASE_URL}/health`);
    if (finalHealth.status === 200) {
      console.log('✅ Post-test health check: PASSED');
    } else {
      console.log('❌ Post-test health check: FAILED');
    }
  }
}

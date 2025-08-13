'use client';

import { useState } from 'react';

interface Endpoint {
  path: string;
  method: string;
  summary: string;
  description: string;
  tags: string[];
  requiresAuth: boolean;
}

interface EndpointCardProps {
  endpoint: Endpoint;
}

const methodColors: { [key: string]: string } = {
  'GET': 'bg-green-100 text-green-800 border-green-200',
  'POST': 'bg-blue-100 text-blue-800 border-blue-200',
  'PUT': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'DELETE': 'bg-red-100 text-red-800 border-red-200',
  'PATCH': 'bg-purple-100 text-purple-800 border-purple-200',
};

export default function EndpointCard({ endpoint }: EndpointCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTryIt = () => {
    // TODO: Implement in M9.3 - Live API Explorer
    console.log('Try endpoint:', endpoint);
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
      {/* Header */}
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Method Badge */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
              methodColors[endpoint.method] || 'bg-gray-100 text-gray-800 border-gray-200'
            }`}>
              {endpoint.method}
            </span>
            
            {/* Path */}
            <code className="font-mono text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded">
              {endpoint.path}
            </code>
            
            {/* Auth Required */}
            {endpoint.requiresAuth && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                🔐 Auth Required
              </span>
            )}
          </div>
          
          {/* Expand/Collapse */}
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleTryIt();
              }}
              className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            >
              Try it
            </button>
            <svg
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {/* Summary */}
        <div className="mt-2">
          <h3 className="text-sm font-medium text-gray-900">
            {endpoint.summary || 'No summary available'}
          </h3>
          {endpoint.description && (
            <p className="text-sm text-gray-600 mt-1">
              {endpoint.description}
            </p>
          )}
        </div>
        
        {/* Tags */}
        {endpoint.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {endpoint.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="space-y-4">
            {/* SDK Integration Example */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                💻 TypeScript SDK Usage
              </h4>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                <pre>{generateSDKExample(endpoint)}</pre>
              </div>
            </div>
            
            {/* Response Example */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                📄 Expected Response
              </h4>
              <div className="bg-white border border-gray-200 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                <pre className="text-gray-700">{generateResponseExample(endpoint)}</pre>
              </div>
            </div>
            
            {/* AI Suggestions Placeholder */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">🤖</span>
                <span className="text-sm font-medium text-blue-800">AI Assistant</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                AI-powered suggestions and payload validation will be available in M9.2
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function generateSDKExample(endpoint: Endpoint): string {
  const { method, path } = endpoint;
  const pathWithParams = path.replace(/{([^}]+)}/g, '${$1}');
  
  if (method === 'GET') {
    if (endpoint.requiresAuth) {
      return `import { NoxClient } from '@nox/sdk';

const client = new NoxClient({
  apiUrl: 'https://api.nox.local',
  token: 'your-auth-token'
});

try {
  const response = await client.get('${pathWithParams}');
  console.log(response.data);
} catch (error) {
  console.error('API Error:', error);
}`;
    } else {
      return `import { NoxClient } from '@nox/sdk';

const client = new NoxClient({
  apiUrl: 'https://api.nox.local'
});

const response = await client.get('${pathWithParams}');
console.log(response.data);`;
    }
  }
  
  if (method === 'POST') {
    return `import { NoxClient } from '@nox/sdk';

const client = new NoxClient({
  apiUrl: 'https://api.nox.local',
  token: 'your-auth-token'
});

const payload = {
  // Your request data here
};

try {
  const response = await client.post('${pathWithParams}', payload);
  console.log(response.data);
} catch (error) {
  console.error('API Error:', error);
}`;
  }
  
  return `import { NoxClient } from '@nox/sdk';

const client = new NoxClient({
  apiUrl: 'https://api.nox.local',
  token: 'your-auth-token'
});

const response = await client.${method.toLowerCase()}('${pathWithParams}');
console.log(response.data);`;
}

function generateResponseExample(endpoint: Endpoint): string {
  const { path, method } = endpoint;
  
  if (path.includes('/health')) {
    return `{
  "status": "healthy",
  "timestamp": "2025-08-13T19:45:00Z",
  "version": "8.0.0"
}`;
  }
  
  if (path.includes('/auth/login') && method === 'POST') {
    return `{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "user": {
    "id": "user-123",
    "username": "john_doe",
    "email": "john@example.com",
    "roles": ["user"]
  }
}`;
  }
  
  if (path.includes('/ai/')) {
    return `{
  "status": "success",
  "confidence": 0.95,
  "result": {
    "analysis": "AI analysis results",
    "recommendations": [
      "Suggestion 1",
      "Suggestion 2"
    ]
  },
  "timestamp": "2025-08-13T19:45:00Z"
}`;
  }
  
  if (path.includes('/nodes/')) {
    return `{
  "total_nodes": 3,
  "healthy_nodes": 3,
  "nodes": [
    {
      "id": "node-1",
      "status": "healthy",
      "load": 0.65,
      "last_seen": "2025-08-13T19:44:58Z"
    }
  ]
}`;
  }
  
  return `{
  "status": "success",
  "data": {},
  "timestamp": "2025-08-13T19:45:00Z"
}`;
}

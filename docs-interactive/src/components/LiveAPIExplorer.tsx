'use client';

import { useCallback, useState } from 'react';
import { APITestRequest, APITestResponse, APITestResult, Endpoint } from '../types/api';

interface LiveAPIExplorerProps {
  endpoint: Endpoint;
  generatedPayload?: string;
  onResponseReceived?: (response: APITestResponse) => void;
}

export default function LiveAPIExplorer({ endpoint, generatedPayload = '', onResponseReceived }: LiveAPIExplorerProps) {
  const [testResult, setTestResult] = useState<APITestResult | null>(null);
  const [authToken, setAuthToken] = useState<string>('');
  const [customHeaders, setCustomHeaders] = useState<Array<{key: string; value: string}>>([]);
  const [requestPayload, setRequestPayload] = useState<string>(generatedPayload);
  const [queryParams, setQueryParams] = useState<Array<{key: string; value: string}>>([]);
  const [baseUrl, setBaseUrl] = useState<string>('https://api.nox.local');
  const [isLoading, setIsLoading] = useState(false);
  const [showOAuthFlow, setShowOAuthFlow] = useState(false);

  // OAuth2 state management
  const [oauthProvider, setOAuthProvider] = useState<'google' | 'github' | 'microsoft'>('google');
  const [oauthStatus, setOAuthStatus] = useState<'idle' | 'authorizing' | 'success' | 'error'>('idle');

  const addCustomHeader = () => {
    setCustomHeaders([...customHeaders, { key: '', value: '' }]);
  };

  const updateCustomHeader = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...customHeaders];
    updated[index][field] = value;
    setCustomHeaders(updated);
  };

  const removeCustomHeader = (index: number) => {
    setCustomHeaders(customHeaders.filter((_, i) => i !== index));
  };

  const addQueryParam = () => {
    setQueryParams([...queryParams, { key: '', value: '' }]);
  };

  const updateQueryParam = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...queryParams];
    updated[index][field] = value;
    setQueryParams(updated);
  };

  const removeQueryParam = (index: number) => {
    setQueryParams(queryParams.filter((_, i) => i !== index));
  };

  const handleOAuthLogin = async (provider: 'google' | 'github' | 'microsoft') => {
    setOAuthStatus('authorizing');
    
    try {
      // Open OAuth window
      const authUrl = `${baseUrl}/auth/${provider}/login`;
      const authWindow = window.open(
        authUrl, 
        'oauth', 
        'width=600,height=600,scrollbars=yes,resizable=yes'
      );

      // Listen for OAuth completion
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'oauth-success') {
          setAuthToken(event.data.token);
          setOAuthStatus('success');
          setShowOAuthFlow(false);
          authWindow?.close();
          window.removeEventListener('message', handleMessage);
        } else if (event.data.type === 'oauth-error') {
          setOAuthStatus('error');
          authWindow?.close();
          window.removeEventListener('message', handleMessage);
        }
      };

      window.addEventListener('message', handleMessage);
      
      // Handle window closed manually
      const checkClosed = setInterval(() => {
        if (authWindow?.closed) {
          clearInterval(checkClosed);
          setOAuthStatus('idle');
          window.removeEventListener('message', handleMessage);
        }
      }, 1000);

    } catch (error) {
      console.error('OAuth error:', error);
      setOAuthStatus('error');
    }
  };

  const executeRequest = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    const startTime = performance.now();

    try {
      // Build URL with query parameters
      const url = new URL(endpoint.path, baseUrl);
      queryParams.forEach(param => {
        if (param.key && param.value) {
          url.searchParams.append(param.key, param.value);
        }
      });

      // Build headers
      const headers: { [key: string]: string } = {
        'Content-Type': 'application/json',
      };

      // Add authentication if available
      if (authToken) {
        headers['Authorization'] = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
      }

      // Add custom headers
      customHeaders.forEach(header => {
        if (header.key && header.value) {
          headers[header.key] = header.value;
        }
      });

      const requestOptions: RequestInit = {
        method: endpoint.method,
        headers,
      };

      // Add body for methods that support it
      if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && requestPayload.trim()) {
        try {
          JSON.parse(requestPayload); // Validate JSON
          requestOptions.body = requestPayload;
        } catch {
          throw new Error('Invalid JSON payload');
        }
      }

      const testRequest: APITestRequest = {
        endpoint,
        method: endpoint.method,
        url: url.toString(),
        headers,
        body: requestPayload ? JSON.parse(requestPayload) : undefined,
        queryParams: Object.fromEntries(queryParams.filter(p => p.key && p.value).map(p => [p.key, p.value]))
      };

      // Execute the request
      const response = await fetch(url.toString(), requestOptions);
      const endTime = performance.now();

      const responseHeaders: { [key: string]: string } = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let responseData: unknown;
      const contentType = response.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      const testResponse: APITestResponse = {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        data: responseData,
        duration: endTime - startTime,
        timestamp: new Date()
      };

      const result: APITestResult = {
        request: testRequest,
        response: testResponse,
        isLoading: false
      };

      setTestResult(result);
      onResponseReceived?.(testResponse);

    } catch (error) {
      const result: APITestResult = {
        request: {
          endpoint,
          method: endpoint.method,
          url: baseUrl + endpoint.path,
          headers: {},
        },
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          code: 'REQUEST_FAILED',
          stack: error instanceof Error ? error.stack : undefined
        },
        isLoading: false
      };

      setTestResult(result);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, baseUrl, authToken, customHeaders, queryParams, requestPayload, isLoading, onResponseReceived]);

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 300 && status < 400) return 'text-yellow-600';
    if (status >= 400 && status < 500) return 'text-orange-600';
    if (status >= 500) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatResponseData = (data: unknown): string => {
    if (typeof data === 'string') {
      try {
        return JSON.stringify(JSON.parse(data), null, 2);
      } catch {
        return data;
      }
    }
    return JSON.stringify(data, null, 2);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">
          🚀 Live API Explorer
        </h4>
        <div className="flex items-center space-x-2">
          {endpoint.requiresAuth && (
            <button
              onClick={() => setShowOAuthFlow(!showOAuthFlow)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                authToken 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-orange-100 text-orange-700 border border-orange-200'
              }`}
            >
              {authToken ? '🔓 Authenticated' : '🔐 Authenticate'}
            </button>
          )}
          <button
            onClick={executeRequest}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded transition-colors ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      </div>

      {/* OAuth2 Flow */}
      {showOAuthFlow && endpoint.requiresAuth && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="text-sm font-medium text-blue-800 mb-3">OAuth2 Authentication</h5>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <label className="text-sm text-blue-700">Provider:</label>
              <select 
                value={oauthProvider}
                onChange={(e) => setOAuthProvider(e.target.value as typeof oauthProvider)}
                className="px-3 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="google">Google</option>
                <option value="github">GitHub</option>
                <option value="microsoft">Microsoft</option>
              </select>
              <button
                onClick={() => handleOAuthLogin(oauthProvider)}
                disabled={oauthStatus === 'authorizing'}
                className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-300 rounded hover:bg-blue-100 disabled:opacity-50"
              >
                {oauthStatus === 'authorizing' ? 'Authorizing...' : `Login with ${oauthProvider}`}
              </button>
            </div>
            {oauthStatus === 'error' && (
              <p className="text-sm text-red-600">Authentication failed. Please try again.</p>
            )}
            {authToken && (
              <div className="text-sm text-green-700">
                ✅ Token: {authToken.substring(0, 20)}...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Request Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Base URL */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Base URL</label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://api.nox.local"
          />
        </div>

        {/* Auth Token (Manual) */}
        {endpoint.requiresAuth && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Auth Token {authToken && '(OAuth2 Active)'}
            </label>
            <input
              type="text"
              value={authToken}
              onChange={(e) => setAuthToken(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Bearer eyJhbGc..."
              disabled={!!authToken && oauthStatus === 'success'}
            />
          </div>
        )}
      </div>

      {/* Query Parameters */}
      {endpoint.method === 'GET' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-medium text-gray-700">Query Parameters</label>
            <button
              onClick={addQueryParam}
              className="px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
            >
              + Add Parameter
            </button>
          </div>
          <div className="space-y-2">
            {queryParams.map((param, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Key"
                  value={param.key}
                  onChange={(e) => updateQueryParam(index, 'key', e.target.value)}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={param.value}
                  onChange={(e) => updateQueryParam(index, 'value', e.target.value)}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={() => removeQueryParam(index)}
                  className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Request Body */}
      {['POST', 'PUT', 'PATCH'].includes(endpoint.method) && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Request Body (JSON)</label>
          <textarea
            value={requestPayload}
            onChange={(e) => setRequestPayload(e.target.value)}
            className="w-full h-32 px-3 py-2 text-xs font-mono border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder='{"key": "value"}'
          />
        </div>
      )}

      {/* Custom Headers */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-medium text-gray-700">Custom Headers</label>
          <button
            onClick={addCustomHeader}
            className="px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
          >
            + Add Header
          </button>
        </div>
        <div className="space-y-2">
          {customHeaders.map((header, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Header Name"
                value={header.key}
                onChange={(e) => updateCustomHeader(index, 'key', e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Header Value"
                value={header.value}
                onChange={(e) => updateCustomHeader(index, 'value', e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={() => removeCustomHeader(index)}
                className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Response Section */}
      {testResult && (
        <div className="border border-gray-200 rounded-lg bg-white">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-medium text-gray-900">Response</h5>
              {testResult.response && (
                <div className="flex items-center space-x-4 text-xs">
                  <span className={`font-medium ${getStatusColor(testResult.response.status)}`}>
                    {testResult.response.status} {testResult.response.statusText}
                  </span>
                  <span className="text-gray-500">
                    {Math.round(testResult.response.duration)}ms
                  </span>
                  <span className="text-gray-500">
                    {testResult.response.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {testResult.error ? (
            <div className="p-4 bg-red-50">
              <div className="text-sm font-medium text-red-800 mb-2">Error</div>
              <div className="text-sm text-red-600">
                {testResult.error.message}
              </div>
              {testResult.error.stack && (
                <details className="mt-2">
                  <summary className="text-xs text-red-500 cursor-pointer">Stack Trace</summary>
                  <pre className="text-xs text-red-500 mt-1 whitespace-pre-wrap">
                    {testResult.error.stack}
                  </pre>
                </details>
              )}
            </div>
          ) : testResult.response && (
            <div className="p-4 space-y-3">
              {/* Response Headers */}
              <div>
                <h6 className="text-xs font-medium text-gray-700 mb-1">Headers</h6>
                <div className="bg-gray-50 border border-gray-200 rounded p-2 text-xs font-mono">
                  {Object.entries(testResult.response.headers).map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="text-blue-600 min-w-0 w-1/3">{key}:</span>
                      <span className="text-gray-700 break-all ml-2">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Response Body */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h6 className="text-xs font-medium text-gray-700">Body</h6>
                  <button
                    onClick={() => navigator.clipboard.writeText(formatResponseData(testResult.response?.data))}
                    className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                  >
                    📋 Copy
                  </button>
                </div>
                <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono overflow-x-auto max-h-64">
                  <pre>{formatResponseData(testResult.response.data)}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

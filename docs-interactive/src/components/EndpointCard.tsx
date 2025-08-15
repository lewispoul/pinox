'use client';

import { useCallback, useEffect, useState } from 'react';
import { APITestResponse, Endpoint, PayloadSuggestion } from '../types/api';
import AIHelper from './AIHelper';
import LiveAPIExplorer from './LiveAPIExplorer';
import PayloadGenerator from './PayloadGenerator';
import SDKGenerator from './SDKGenerator';
import { HoverCard, MorphingIcon, useFadeIn, useRipple } from './ui/Animations';
import { AnimatedButton } from './ui/LoadingComponents';
import { CollapsibleSection, useIsMobile, useTouchGestures } from './ui/ResponsiveUtils';

interface EndpointCardProps {
  endpoint: Endpoint;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const methodColors: { [key: string]: string } = {
  'GET': 'bg-green-100 text-green-800 border-green-200',
  'POST': 'bg-blue-100 text-blue-800 border-blue-200',
  'PUT': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'DELETE': 'bg-red-100 text-red-800 border-red-200',
  'PATCH': 'bg-purple-100 text-purple-800 border-purple-200',
};

export default function EndpointCard({ endpoint, isFavorite = false, onToggleFavorite }: EndpointCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState<PayloadSuggestion[]>([]);
  const [showPayloadGenerator, setShowPayloadGenerator] = useState(false);
  const [showLiveExplorer, setShowLiveExplorer] = useState(false);
  const [showSDKGenerator, setShowSDKGenerator] = useState(false);
  const [generatedPayload, setGeneratedPayload] = useState<string>('');
  const [lastResponse, setLastResponse] = useState<APITestResponse | null>(null);

  // Mobile optimization hooks
  const isMobile = useIsMobile();
  const { addRipple, RippleContainer } = useRipple();
  const fadeIn = useFadeIn(100);

  // Touch gestures for mobile
  const touchGestures = useTouchGestures(
    () => {}, // onSwipeLeft
    () => {}, // onSwipeRight  
    () => setIsExpanded(false), // onSwipeUp - collapse
    () => setIsExpanded(true)   // onSwipeDown - expand
  );

  const loadAISuggestions = useCallback(async () => {
    // Simulate loading AI suggestions
    const aiSuggestions: PayloadSuggestion[] = [];
    
    if (endpoint.method === 'POST' && endpoint.requiresAuth) {
      aiSuggestions.push({
        confidence: 0.92,
        suggestion: { "Authorization": "Bearer your-jwt-token" },
        explanation: "This endpoint requires authentication via Bearer token",
        category: 'headers'
      });
    }
    
    if (endpoint.method === 'POST') {
      aiSuggestions.push({
        confidence: 0.88,
        suggestion: { validate: true, timeout: 30000 },
        explanation: "Enable request validation and set a reasonable timeout",
        category: 'validation'
      });
    }
    
    setSuggestions(aiSuggestions);
  }, [endpoint.method, endpoint.requiresAuth]);

  useEffect(() => {
    // Load initial AI suggestions when component mounts
    if (isExpanded) {
      loadAISuggestions();
    }
  }, [isExpanded, loadAISuggestions]);

  const handleTryIt = () => {
    setShowPayloadGenerator(!showPayloadGenerator);
    setShowLiveExplorer(!showLiveExplorer);
  };

  const handleSuggestionApply = (suggestion: PayloadSuggestion) => {
    console.log('Applied suggestion:', suggestion);
    // TODO: Implement suggestion application logic
  };

  const handlePayloadGenerated = (payload: string) => {
    setGeneratedPayload(payload);
  };

  const handleResponseReceived = (response: APITestResponse) => {
    setLastResponse(response);
  };

  return (
    <HoverCard className="relative overflow-hidden" hoverScale={1.01}>
      <div 
        ref={fadeIn.ref}
        className={`border border-gray-200 rounded-lg bg-white transition-all duration-300 ${fadeIn.className}`}
        {...touchGestures}
      >
        <RippleContainer />
        
        {/* Header */}
        <div 
          className="p-4 cursor-pointer relative"
          onClick={(e) => {
            addRipple(e);
            setIsExpanded(!isExpanded);
          }}
        >
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 ${isMobile ? 'flex-wrap' : ''}`}>
              {/* Method Badge */}
              <span className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                methodColors[endpoint.method] || 'bg-gray-100 text-gray-800 border-gray-200'
              }`}>
                {endpoint.method}
              </span>
              
              {/* Path */}
              <code className={`font-mono text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded transition-colors hover:bg-gray-100 ${
                isMobile ? 'text-xs break-all' : ''
              }`}>
                {endpoint.path}
              </code>
              
              {/* Auth Required */}
              {endpoint.requiresAuth && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800 animate-pulse-low">
                  🔐 Auth Required
                </span>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className={`flex items-center space-x-2 ${isMobile ? 'flex-col space-y-1 space-x-0' : ''}`}>
              {/* Favorite Button */}
              {onToggleFavorite && (
                <div title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                  <AnimatedButton
                    onClick={() => onToggleFavorite()}
                    variant="secondary"
                    size={isMobile ? 'sm' : 'md'}
                    className={`transition-all duration-200 ${
                      isFavorite
                        ? 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 scale-110'
                        : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                    }`}
                  >
                    <div onClick={(e) => e.stopPropagation()}>
                      <span className={`transition-transform duration-200 ${isFavorite ? 'animate-bounce' : ''}`}>
                        {isFavorite ? '⭐' : '☆'}
                      </span>
                    </div>
                  </AnimatedButton>
                </div>
              )}
              
              <AnimatedButton
                onClick={() => {
                  setShowSDKGenerator(!showSDKGenerator);
                }}
                variant="secondary"
                size={isMobile ? 'sm' : 'md'}
                className="text-green-600 hover:text-green-800 hover:bg-green-50"
              >
                <MorphingIcon
                  icon1={<span>📦</span>}
                  icon2={<span>❌</span>}
                  isToggled={showSDKGenerator}
                />
                <span className="ml-1">{showSDKGenerator ? 'Hide SDK' : 'SDK'}</span>
              </AnimatedButton>
              
              <AnimatedButton
                onClick={() => {
                  handleTryIt();
                }}
                variant="secondary"
                size={isMobile ? 'sm' : 'md'}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                <MorphingIcon
                  icon1={<span>🧪</span>}
                  icon2={<span>👁️</span>}
                  isToggled={showLiveExplorer}
                />
                <span className="ml-1">{showLiveExplorer ? 'Hide' : 'Test'}</span>
              </AnimatedButton>
              
              {/* AI Helper Integration */}
              <AIHelper 
                endpoint={endpoint} 
                onSuggestionApply={handleSuggestionApply}
              />
              
              {/* Expand/Collapse with morphing icon */}
              <MorphingIcon
                icon1={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>}
                icon2={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>}
                isToggled={isExpanded}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              />
            </div>
          </div>
          
          {/* Summary */}
          <div className="mt-3">
            <h3 className="text-sm font-medium text-gray-900 leading-relaxed">
              {endpoint.summary || 'No summary available'}
            </h3>
            {endpoint.description && (
              <p className={`text-sm text-gray-600 mt-2 leading-relaxed ${
                isMobile ? 'text-xs' : ''
              }`}>
                {endpoint.description}
              </p>
            )}
          </div>
          
          {/* Tags */}
          {endpoint.tags.length > 0 && (
            <div className={`flex flex-wrap gap-2 mt-3 ${isMobile ? 'gap-1' : ''}`}>
              {endpoint.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-gray-200 bg-gray-50">
            <div className="p-4 space-y-4">
              {/* Mobile: Use collapsible sections */}
              {isMobile ? (
                <div className="space-y-3">
                  {/* SDK Generator */}
                  {showSDKGenerator && (
                    <CollapsibleSection 
                      title="📦 SDK Generator" 
                      defaultOpen={true}
                      className="bg-white rounded-lg shadow-sm"
                    >
                      <SDKGenerator 
                        endpoint={endpoint} 
                        generatedPayload={generatedPayload}
                      />
                    </CollapsibleSection>
                  )}

                  {/* Live API Explorer */}
                  {showLiveExplorer && (
                    <CollapsibleSection 
                      title="🧪 Live API Explorer" 
                      defaultOpen={true}
                      className="bg-white rounded-lg shadow-sm"
                    >
                      <LiveAPIExplorer 
                        endpoint={endpoint} 
                        generatedPayload={generatedPayload}
                        onResponseReceived={handleResponseReceived}
                      />
                    </CollapsibleSection>
                  )}

                  {/* Payload Generator */}
                  {showPayloadGenerator && (endpoint.method === 'POST' || endpoint.method === 'PUT' || endpoint.method === 'PATCH') && (
                    <CollapsibleSection 
                      title="⚙️ Payload Generator" 
                      defaultOpen={true}
                      className="bg-white rounded-lg shadow-sm"
                    >
                      <PayloadGenerator 
                        endpoint={endpoint} 
                        suggestions={suggestions}
                        onPayloadGenerated={handlePayloadGenerated}
                      />
                    </CollapsibleSection>
                  )}

                  {/* Response Preview */}
                  {lastResponse && (
                    <CollapsibleSection 
                      title="📊 Last Response" 
                      defaultOpen={false}
                      className="bg-white rounded-lg shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-sm font-medium ${
                          lastResponse.status >= 200 && lastResponse.status < 300 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {lastResponse.status} - {Math.round(lastResponse.duration)}ms
                        </span>
                      </div>
                      <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono overflow-x-auto max-h-32">
                        <pre>{JSON.stringify(lastResponse.data, null, 2)}</pre>
                      </div>
                    </CollapsibleSection>
                  )}

                  <CollapsibleSection 
                    title="💻 TypeScript SDK Usage" 
                    defaultOpen={false}
                    className="bg-white rounded-lg shadow-sm"
                  >
                    <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                      <pre>{generateSDKExample(endpoint)}</pre>
                    </div>
                  </CollapsibleSection>
                  
                  <CollapsibleSection 
                    title="📄 Expected Response" 
                    defaultOpen={false}
                    className="bg-white rounded-lg shadow-sm"
                  >
                    <div className="bg-white border border-gray-200 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                      <pre className="text-gray-700">{generateResponseExample(endpoint)}</pre>
                    </div>
                  </CollapsibleSection>
                </div>
              ) : (
                /* Desktop: Standard layout */
                <div className="space-y-6">
                  {/* SDK Generator */}
                  {showSDKGenerator && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      <SDKGenerator 
                        endpoint={endpoint} 
                        generatedPayload={generatedPayload}
                      />
                    </div>
                  )}

                  {/* Live API Explorer */}
                  {showLiveExplorer && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      <LiveAPIExplorer 
                        endpoint={endpoint} 
                        generatedPayload={generatedPayload}
                        onResponseReceived={handleResponseReceived}
                      />
                    </div>
                  )}

                  {/* Payload Generator */}
                  {showPayloadGenerator && (endpoint.method === 'POST' || endpoint.method === 'PUT' || endpoint.method === 'PATCH') && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      <PayloadGenerator 
                        endpoint={endpoint} 
                        suggestions={suggestions}
                        onPayloadGenerated={handlePayloadGenerated}
                      />
                    </div>
                  )}

                  {/* Response Preview */}
                  {lastResponse && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          📊 Last Response
                        </h4>
                        <span className={`text-xs font-medium ${
                          lastResponse.status >= 200 && lastResponse.status < 300 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {lastResponse.status} - {Math.round(lastResponse.duration)}ms
                        </span>
                      </div>
                      <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono overflow-x-auto max-h-32">
                        <pre>{JSON.stringify(lastResponse.data, null, 2)}</pre>
                      </div>
                    </div>
                  )}
                  
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
                </div>
              )}
              
              {/* AI Insights - Always visible */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-purple-600 animate-pulse-low">🤖</span>
                  <span className="text-sm font-medium text-purple-800">AI Insights</span>
                </div>
                <div className={`text-purple-700 space-y-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {endpoint.requiresAuth && (
                    <p>• This endpoint requires authentication - don&apos;t forget your Bearer token</p>
                  )}
                  {endpoint.method === 'POST' && (
                    <p>• POST requests typically need a JSON payload in the request body</p>
                  )}
                  {endpoint.path.includes('/ai/') && (
                    <p>• AI endpoints may take longer to respond due to model processing</p>
                  )}
                  {suggestions.length > 0 && (
                    <p>• {suggestions.length} AI suggestions available - click the AI Assistant for help</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </HoverCard>
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

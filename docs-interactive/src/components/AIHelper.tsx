'use client';

import { useEffect, useState } from 'react';
import { Endpoint } from '../types/api';

interface AIHelperProps {
  endpoint: Endpoint;
  onSuggestionApply?: (suggestion: PayloadSuggestion) => void;
}

interface PayloadSuggestion {
  confidence: number;
  suggestion: any;
  explanation: string;
  category: 'payload' | 'parameters' | 'headers' | 'validation';
}

interface AIMessage {
  type: 'user' | 'assistant';
  content: string;
  suggestions?: PayloadSuggestion[];
  timestamp: Date;
}

export default function AIHelper({ endpoint, onSuggestionApply }: AIHelperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [suggestions, setSuggestions] = useState<PayloadSuggestion[]>([]);

  // Initialize with welcome message when component mounts
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: AIMessage = {
        type: 'assistant',
        content: `Hello! I'm your AI assistant for the ${endpoint.method} ${endpoint.path} endpoint. I can help you with:\n\n• Generate example payloads\n• Validate parameters\n• Explain error responses\n• Suggest best practices\n\nWhat would you like help with?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      generateInitialSuggestions();
    }
  }, [isOpen, endpoint, messages.length]);

  const generateInitialSuggestions = async () => {
    // Simulate AI-generated suggestions based on endpoint
    const endpointSuggestions = await generateSuggestionsForEndpoint(endpoint);
    setSuggestions(endpointSuggestions);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage: AIMessage = {
      type: 'user',
      content: userInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsThinking(true);

    // Simulate AI response
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(userInput, endpoint);
      const assistantMessage: AIMessage = {
        type: 'assistant',
        content: aiResponse.content,
        suggestions: aiResponse.suggestions,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsThinking(false);
    }, 1500);
  };

  const applySuggestion = (suggestion: PayloadSuggestion) => {
    onSuggestionApply?.(suggestion);
    
    const confirmMessage: AIMessage = {
      type: 'assistant',
      content: `Great! I've applied the ${suggestion.category} suggestion. ${suggestion.explanation}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmMessage]);
  };

  return (
    <div className="relative">
      {/* AI Helper Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          isOpen 
            ? 'bg-purple-100 text-purple-700 border border-purple-200' 
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
        }`}
      >
        <span className="mr-2">🤖</span>
        AI Assistant
        {suggestions.length > 0 && !isOpen && (
          <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {suggestions.length}
          </span>
        )}
      </button>

      {/* AI Helper Panel */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-purple-600">🤖</span>
              <h3 className="font-medium text-gray-900">AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Quick Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-4 border-b border-gray-100 bg-purple-50">
              <h4 className="text-sm font-medium text-purple-800 mb-2">💡 Quick Suggestions</h4>
              <div className="space-y-2">
                {suggestions.slice(0, 2).map((suggestion, index) => (
                  <div key={index} className="flex items-start justify-between p-2 bg-white rounded border border-purple-100">
                    <div className="flex-1">
                      <p className="text-xs text-purple-700 font-medium">
                        {suggestion.category.toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        {suggestion.explanation}
                      </p>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center text-xs text-purple-600">
                          <span className="mr-1">⭐</span>
                          {Math.round(suggestion.confidence * 100)}% confidence
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => applySuggestion(suggestion)}
                      className="ml-2 px-2 py-1 text-xs font-medium text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded"
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.suggestions.map((suggestion, suggestionIndex) => (
                        <button
                          key={suggestionIndex}
                          onClick={() => applySuggestion(suggestion)}
                          className="block w-full text-left p-2 bg-white bg-opacity-20 rounded text-xs hover:bg-opacity-30"
                        >
                          {suggestion.explanation}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg text-sm">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about payloads, parameters, or errors..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!userInput.trim() || isThinking}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// AI Logic Functions
async function generateSuggestionsForEndpoint(endpoint: Endpoint): Promise<PayloadSuggestion[]> {
  const suggestions: PayloadSuggestion[] = [];

  // Generate endpoint-specific suggestions
  if (endpoint.method === 'POST' && endpoint.path.includes('/auth/login')) {
    suggestions.push({
      confidence: 0.95,
      suggestion: {
        email: "user@example.com",
        password: "secure_password_123"
      },
      explanation: "Standard login payload with email and password fields",
      category: 'payload'
    });
  }

  if (endpoint.path.includes('/ai/')) {
    suggestions.push({
      confidence: 0.88,
      suggestion: {
        confidence_threshold: 0.8,
        include_recommendations: true
      },
      explanation: "AI endpoints typically benefit from confidence thresholds",
      category: 'parameters'
    });
  }

  if (endpoint.requiresAuth) {
    suggestions.push({
      confidence: 0.92,
      suggestion: {
        "Authorization": "Bearer your-jwt-token"
      },
      explanation: "This endpoint requires authentication via Bearer token",
      category: 'headers'
    });
  }

  // Add validation suggestions for all endpoints
  suggestions.push({
    confidence: 0.85,
    suggestion: {
      validate: true,
      timeout: 30000
    },
    explanation: "Enable request validation and set a reasonable timeout",
    category: 'validation'
  });

  return suggestions;
}

async function generateAIResponse(userInput: string, endpoint: Endpoint): Promise<{
  content: string;
  suggestions?: PayloadSuggestion[];
}> {
  const input = userInput.toLowerCase();
  
  if (input.includes('payload') || input.includes('example') || input.includes('data')) {
    const suggestions = await generatePayloadSuggestions(endpoint);
    return {
      content: `I'll help you create a payload for ${endpoint.method} ${endpoint.path}. Here are some suggestions based on the endpoint structure:`,
      suggestions
    };
  }

  if (input.includes('error') || input.includes('fail') || input.includes('problem')) {
    return {
      content: `Common errors for ${endpoint.method} ${endpoint.path}:\n\n• 401 Unauthorized: Check your authentication token\n• 400 Bad Request: Validate your payload structure\n• 429 Too Many Requests: You're hitting rate limits\n• 500 Internal Server Error: Server-side issue, try again later\n\nWould you like help with debugging a specific error code?`
    };
  }

  if (input.includes('auth') || input.includes('token') || input.includes('login')) {
    if (endpoint.requiresAuth) {
      return {
        content: `This endpoint requires authentication. You'll need to:\n\n1. Obtain a JWT token from /auth/login\n2. Include it in the Authorization header: Bearer <token>\n3. Ensure your token hasn't expired\n\nWould you like help generating a login request?`
      };
    } else {
      return {
        content: `This endpoint doesn't require authentication - you can call it directly without any tokens!`
      };
    }
  }

  // General help
  return {
    content: `I can help you with several things for ${endpoint.method} ${endpoint.path}:\n\n• Generate example payloads\n• Explain authentication requirements\n• Debug error responses\n• Suggest best practices\n\nWhat specific area would you like help with?`
  };
}

async function generatePayloadSuggestions(endpoint: Endpoint): Promise<PayloadSuggestion[]> {
  const suggestions: PayloadSuggestion[] = [];

  if (endpoint.method === 'POST' && endpoint.path.includes('/auth/login')) {
    suggestions.push({
      confidence: 0.95,
      suggestion: {
        email: "user@example.com",
        password: "your_password",
        remember_me: true
      },
      explanation: "Complete login payload with optional remember_me flag",
      category: 'payload'
    });
  }

  if (endpoint.method === 'POST' && endpoint.path.includes('/ai/security/assess')) {
    suggestions.push({
      confidence: 0.90,
      suggestion: {
        user_id: "user-123",
        ip_address: "192.168.1.100",
        user_agent: "Mozilla/5.0...",
        session_data: {
          login_time: "2025-08-13T19:45:00Z",
          previous_locations: ["US", "CA"]
        }
      },
      explanation: "Security assessment payload with user context and session data",
      category: 'payload'
    });
  }

  if (endpoint.method === 'POST' && endpoint.path.includes('/nodes')) {
    suggestions.push({
      confidence: 0.87,
      suggestion: {
        node_id: "node-" + Math.random().toString(36).substr(2, 9),
        capabilities: ["compute", "storage"],
        resources: {
          cpu_cores: 4,
          memory_gb: 16,
          storage_gb: 500
        }
      },
      explanation: "Node registration with typical resource specifications",
      category: 'payload'
    });
  }

  return suggestions;
}

'use client';

import { useState } from 'react';
import { FloatingActionButton } from './ui/Animations';
import { AnimatedButton } from './ui/LoadingComponents';
import { MobileDrawer, useViewport } from './ui/ResponsiveUtils';

export default function FloatingActions() {
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { isMobile } = useViewport();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToEndpoints = () => {
    const endpointsSection = document.querySelector('[data-endpoints]');
    if (endpointsSection) {
      endpointsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isMobile) return null;

  return (
    <>
      {/* Main FAB */}
      <FloatingActionButton
        onClick={() => setShowQuickActions(true)}
        icon={<span className="text-lg">⚡</span>}
        tooltip="Quick Actions"
        position="bottom-right"
        color="blue"
      />

      {/* Scroll to Top FAB */}
      <FloatingActionButton
        onClick={scrollToTop}
        icon={<span className="text-lg">⬆️</span>}
        tooltip="Scroll to Top"
        position="bottom-left"
        color="green"
        size="sm"
      />

      {/* Quick Actions Drawer */}
      <MobileDrawer
        isOpen={showQuickActions}
        onClose={() => setShowQuickActions(false)}
        title="Quick Actions"
        position="bottom"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <AnimatedButton
              onClick={scrollToEndpoints}
              variant="primary"
              className="flex flex-col items-center py-4"
            >
              <span className="text-lg mb-1">📋</span>
              <span className="text-xs">Endpoints</span>
            </AnimatedButton>

            <AnimatedButton
              onClick={() => setShowSearch(true)}
              variant="secondary"
              className="flex flex-col items-center py-4"
            >
              <span className="text-lg mb-1">🔍</span>
              <span className="text-xs">Search</span>
            </AnimatedButton>

            <AnimatedButton
              onClick={() => window.open('https://github.com/nox-api/sdk', '_blank')}
              variant="secondary"
              className="flex flex-col items-center py-4"
            >
              <span className="text-lg mb-1">📦</span>
              <span className="text-xs">SDK Docs</span>
            </AnimatedButton>

            <AnimatedButton
              onClick={() => window.open('/api/health', '_blank')}
              variant="success"
              className="flex flex-col items-center py-4"
            >
              <span className="text-lg mb-1">❤️</span>
              <span className="text-xs">Health</span>
            </AnimatedButton>
          </div>

          <div className="border-t pt-4">
            <div className="text-center text-sm text-gray-600 mb-3">
              Quick Stats
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-lg font-bold text-green-600">99%</div>
                <div className="text-xs text-gray-600">Uptime</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-lg font-bold text-blue-600">12ms</div>
                <div className="text-xs text-gray-600">Response</div>
              </div>
            </div>
          </div>
        </div>
      </MobileDrawer>

      {/* Search Drawer */}
      <MobileDrawer
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        title="Search Endpoints"
        position="right"
      >
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search endpoints..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Popular Endpoints</h4>
            <div className="space-y-1">
              {[
                { path: '/api/auth/login', method: 'POST', color: 'blue' },
                { path: '/api/nodes/status', method: 'GET', color: 'green' },
                { path: '/api/ai/analyze', method: 'POST', color: 'purple' },
                { path: '/api/health', method: 'GET', color: 'green' }
              ].map((endpoint, index) => (
                <button
                  key={index}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded flex items-center space-x-2"
                  onClick={() => {
                    // TODO: Implement search navigation
                    setShowSearch(false);
                  }}
                >
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    endpoint.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                    endpoint.color === 'green' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-xs font-mono text-gray-600">{endpoint.path}</code>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Filter by Method</h4>
            <div className="flex flex-wrap gap-2">
              {['GET', 'POST', 'PUT', 'DELETE'].map((method) => (
                <button
                  key={method}
                  className="px-3 py-1 text-xs border rounded-full hover:bg-gray-50 transition-colors"
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        </div>
      </MobileDrawer>
    </>
  );
}

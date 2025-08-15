import EndpointsList from '@/components/EndpointsList';
import FloatingActions from '@/components/FloatingActions';
import { AnimatedCounter, StaggeredList } from '@/components/ui/Animations';
import LoadingSpinner, { SkeletonCard } from '@/components/ui/LoadingComponents';
import { StickyHeader, ViewportProvider } from '@/components/ui/ResponsiveUtils';
import { Suspense } from 'react';

export default function Home() {
  return (
    <ViewportProvider>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Sticky Header */}
        <StickyHeader threshold={50}>
          <div className="bg-white/95 backdrop-blur-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="text-center lg:text-left">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                    Nox API v8.0.0 Documentation
                  </h1>
                  <p className="mt-1 lg:mt-2 text-sm lg:text-base text-gray-600">
                    Interactive API documentation with AI-powered assistance
                  </p>
                </div>
                
                <div className="flex items-center justify-center lg:justify-end space-x-3 lg:space-x-4">
                  <span className="inline-flex items-center px-2 py-1 lg:px-3 lg:py-1 rounded-full text-xs lg:text-sm font-medium bg-green-100 text-green-800 animate-pulse-low">
                    ✨ AI Enhanced
                  </span>
                  <span className="inline-flex items-center px-2 py-1 lg:px-3 lg:py-1 rounded-full text-xs lg:text-sm font-medium bg-blue-100 text-blue-800">
                    v8.0.0
                  </span>
                </div>
              </div>
            </div>
          </div>
        </StickyHeader>

        {/* Features Banner */}
        <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
            <StaggeredList 
              staggerDelay={150}
              className="grid grid-cols-2 lg:flex lg:flex-wrap gap-3 lg:gap-6 text-xs lg:text-sm"
            >
              <div className="flex items-center justify-center lg:justify-start">
                <span className="text-blue-600 mr-2 text-lg lg:text-base">🤖</span>
                <span className="text-center lg:text-left">AI Integration & Security</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start">
                <span className="text-green-600 mr-2 text-lg lg:text-base">🔗</span>
                <span className="text-center lg:text-left">Multi-node Cluster</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start">
                <span className="text-purple-600 mr-2 text-lg lg:text-base">⚡</span>
                <span className="text-center lg:text-left">TypeScript SDK</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start">
                <span className="text-orange-600 mr-2 text-lg lg:text-base">📊</span>
                <span className="text-center lg:text-left">Real-time Monitoring</span>
              </div>
            </StaggeredList>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl lg:text-3xl font-bold text-blue-600">
                  <AnimatedCounter end={47} suffix="+" />
                </div>
                <div className="text-xs lg:text-sm text-gray-600 mt-1">API Endpoints</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl lg:text-3xl font-bold text-green-600">
                  <AnimatedCounter end={99} suffix="%" />
                </div>
                <div className="text-xs lg:text-sm text-gray-600 mt-1">Uptime</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl lg:text-3xl font-bold text-purple-600">
                  <AnimatedCounter end={3} suffix=" Nodes" />
                </div>
                <div className="text-xs lg:text-sm text-gray-600 mt-1">Multi-node Cluster</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl lg:text-3xl font-bold text-orange-600">
                  <AnimatedCounter end={12} suffix="ms" />
                </div>
                <div className="text-xs lg:text-sm text-gray-600 mt-1">Avg Response</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Quick Start & SDK */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Start */}
              <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">🚀</span>
                  Quick Start
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-600 text-xs font-bold rounded-full mr-3 mt-0.5">1</span>
                    <span>Choose an endpoint from the list</span>
                  </div>
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-600 text-xs font-bold rounded-full mr-3 mt-0.5">2</span>
                    <span>Configure parameters with AI suggestions</span>
                  </div>
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-purple-100 text-purple-600 text-xs font-bold rounded-full mr-3 mt-0.5">3</span>
                    <span>Test live with authentication</span>
                  </div>
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-orange-100 text-orange-600 text-xs font-bold rounded-full mr-3 mt-0.5">4</span>
                    <span>View real-time metrics & generate SDKs</span>
                  </div>
                </div>
              </div>

              {/* SDK Integration */}
              <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">🔧</span>
                  SDK Integration
                </h3>
                <div className="bg-gray-900 rounded-lg p-3 mb-3">
                  <code className="text-sm text-green-400 font-mono">
                    npm install @nox/sdk
                  </code>
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• TypeScript SDK with full AI capabilities</p>
                  <p>• Multi-node cluster support</p>
                  <p>• Real-time monitoring</p>
                  <p>• Auto-generated from OpenAPI spec</p>
                </div>
              </div>

              {/* Live Status */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200 p-4 lg:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></span>
                  System Status
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">API Status:</span>
                    <span className="text-green-600 font-medium">Operational</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Nodes:</span>
                    <span className="text-blue-600 font-medium">3/3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response Time:</span>
                    <span className="text-purple-600 font-medium">&lt;15ms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - API Endpoints */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden" data-endpoints>
                <div className="p-4 lg:p-6 border-b bg-gradient-to-r from-gray-50 to-white">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <span className="mr-2">📋</span>
                    API Endpoints
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm lg:text-base">
                    Explore all available endpoints with interactive testing
                  </p>
                </div>
                
                <div className="p-4 lg:p-6">
                  <Suspense fallback={
                    <div className="space-y-4">
                      <div className="flex items-center justify-center py-8">
                        <LoadingSpinner 
                          size="lg" 
                          color="blue" 
                          text="Loading API endpoints"
                        />
                      </div>
                      <div className="grid gap-4">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                      </div>
                    </div>
                  }>
                    <EndpointsList />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Actions for Mobile */}
        <FloatingActions />
      </main>
    </ViewportProvider>
  );
}

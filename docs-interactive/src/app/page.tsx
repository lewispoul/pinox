import { Suspense } from 'react';
// import EndpointsList from '@/components/EndpointsList';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Nox API v8.0.0 Documentation
              </h1>
              <p className="mt-2 text-gray-600">
                Interactive API documentation with AI-powered assistance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                ✨ AI Enhanced
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                v8.0.0
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center">
              <span className="text-blue-600 mr-2">🤖</span>
              AI Integration & Security
            </div>
            <div className="flex items-center">
              <span className="text-green-600 mr-2">🔗</span>
              Multi-node Cluster Support
            </div>
            <div className="flex items-center">
              <span className="text-purple-600 mr-2">⚡</span>
              Enhanced TypeScript SDK
            </div>
            <div className="flex items-center">
              <span className="text-orange-600 mr-2">📊</span>
              Real-time Monitoring
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Start */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🚀 Quick Start
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>1. Choose an endpoint from the list</p>
                <p>2. Configure parameters with AI suggestions</p>
                <p>3. Test live with authentication</p>
                <p>4. View real-time metrics</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🔧 SDK Integration
              </h3>
              <div className="bg-gray-50 rounded p-3">
                <code className="text-sm text-gray-800">
                  npm install @nox/sdk
                </code>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <p>TypeScript SDK with full AI capabilities and multi-node support</p>
              </div>
            </div>
          </div>

          {/* Right Column - API Endpoints */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  API Endpoints
                </h2>
                <p className="text-gray-600 mt-1">
                  Explore all available endpoints with interactive testing
                </p>
              </div>
              <div className="p-6">
                <Suspense fallback={
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                }>
                  {/* <EndpointsList /> */}
                  <div className="text-gray-500 text-center py-8">
                    EndpointsList component not found. Please create <code className="bg-gray-100 px-2 py-1 rounded">@/components/EndpointsList.tsx</code> to display endpoints.
                  </div>
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

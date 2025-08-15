'use client';

import EndpointsList from '@/components/EndpointsList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Nox API Documentation
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">API Endpoints</h2>
          <EndpointsList />
        </div>
      </div>
    </div>
  );
}

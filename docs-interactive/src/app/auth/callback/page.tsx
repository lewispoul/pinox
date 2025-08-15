'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function OAuthCallback() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    const provider = searchParams.get('provider');
    
    if (window.opener) {
      if (token) {
        // Send success message to parent window
        window.opener.postMessage({
          type: 'oauth-success',
          token,
          provider
        }, window.location.origin);
      } else if (error) {
        // Send error message to parent window
        window.opener.postMessage({
          type: 'oauth-error',
          error,
          provider
        }, window.location.origin);
      }
      
      // Close the popup
      window.close();
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing authentication...</p>
        <p className="text-sm text-gray-500 mt-2">This window will close automatically.</p>
      </div>
    </div>
  );
}

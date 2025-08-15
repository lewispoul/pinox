'use client';

import dynamic from "next/dynamic";

// Client-side only WebVitals monitor
const WebVitalsMonitor = dynamic(
  () => import('@/components/WebVitalsMonitor'),
  { 
    ssr: false,
    loading: () => null
  }
);

export default function ClientOnlyWebVitals() {
  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return <WebVitalsMonitor />;
}

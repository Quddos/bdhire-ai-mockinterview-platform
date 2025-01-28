'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/hooks/useSubscription';

export default function ToolPage({ params }) {
  const { isSubscribed } = useSubscription();
  const router = useRouter();
  const toolName = params.toolName;

  useEffect(() => {
    if (!isSubscribed) {
      // Optional: Add a message or alert here
      // router.push('/'); // Uncomment this if you want to redirect
    }
  }, [isSubscribed]);

  if (!isSubscribed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Subscribe to Access</h1>
        <p className="text-center mb-4">
          Please subscribe to our YouTube channel to access this tool.
        </p>
        <button
          onClick={() => window.open('https://www.youtube.com/@Qudmeet?sub_confirmation=1', '_blank')}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        >
          Subscribe to Qudmeet
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Your tool content here */}
      <h1>Tool: {toolName}</h1>
    </div>
  );
} 
'use client';

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RotateCw } from 'lucide-react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error to external service or console
    logApplicationError({
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-gradient-to-br from-slate-50 to-white">
      <main
        role="main"
        aria-label="Error Page"
        className="text-center max-w-lg w-full"
      >
        {/* Error Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
          <AlertTriangle size={40} className="text-red-600" aria-hidden="true" />
        </div>

        {/* Error Content */}
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Something Went Wrong
        </h1>

        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
          An unexpected error occurred while processing your request. 
          Our team has been notified and is working to fix it.
        </p>

        {/* Error Details (Development Only) */}
        {isDevelopment && error.message && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="text-sm font-mono text-red-700 break-words">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            aria-label="Try again"
          >
            <RotateCw size={20} aria-hidden="true" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-primary-600 hover:text-primary-600 hover:bg-primary-50 transition font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Home size={20} aria-hidden="true" />
            Go Home
          </Link>
        </div>

        {/* Support Info */}
        <div className="border-t border-slate-200 pt-8">
          <p className="text-sm text-slate-600 mb-4">
            If the problem persists, please contact our support team.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded px-2 py-1"
          >
            Contact Support
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 mb-8 text-center text-xs text-slate-400">
        <p>Error reported at {new Date().toLocaleTimeString()}</p>
      </footer>
    </div>
  );
}

/**
 * Log application error to backend
 */
async function logApplicationError(data: {
  message: string;
  digest?: string;
  stack?: string;
  timestamp: string;
}) {
  try {
    await fetch('/api/logs/error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => {
      // Silent fail - don't break error handling if logging fails
    });
  } catch (error) {
    console.error('Failed to log error:', error);
  }
}

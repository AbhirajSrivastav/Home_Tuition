'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Home, Search, MessageSquare, Map } from 'lucide-react';

export const metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggingError, setIsLoggingError] = useState(false);

  useEffect(() => {
    // Log 404 page view
    logPageNotFound({
      path: typeof window !== 'undefined' ? window.location.pathname : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      timestamp: new Date().toISOString(),
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-gradient-to-br from-slate-50 to-white">
      {/* Main Content */}
      <main
        role="main"
        aria-label="404 Error Page"
        className="text-center max-w-2xl w-full"
      >
        {/* 404 Display */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-6">
            <span className="text-5xl font-bold text-red-600">404</span>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full mb-8"></div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Page Not Found
          </h1>

          <p className="text-lg text-slate-600 mb-2 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-base text-slate-500">
            Let's help you get back on track.
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-12">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for courses, tutors, topics..."
                aria-label="Search for content"
                className="flex-1 px-4 py-3 rounded-lg border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
              />
              <button
                type="submit"
                aria-label="Submit search query"
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Search size={20} aria-hidden="true" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
            <p className="text-sm text-slate-500">
              Try searching for what you need or browse our popular categories below.
            </p>
          </form>
        </div>

        {/* Primary Navigation */}
        <nav
          aria-label="Suggested Navigation"
          className="flex flex-col sm:flex-row gap-3 justify-center mb-16"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Home size={20} aria-hidden="true" />
            Go to Home
          </Link>

          <Link
            href="/tutors"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-primary-600 hover:text-primary-600 hover:bg-primary-50 transition font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Map size={20} aria-hidden="true" />
            Browse Tutors
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-primary-600 hover:text-primary-600 hover:bg-primary-50 transition font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <MessageSquare size={20} aria-hidden="true" />
            Contact Us
          </Link>
        </nav>

        {/* Quick Links / Sitemap */}
        <section
          aria-label="Quick Navigation Links"
          className="border-t border-slate-200 pt-12"
        >
          <h2 className="text-sm text-slate-600 mb-8 font-semibold tracking-wide">
            QUICK LINKS
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {[
              { href: '/', label: 'Home' },
              { href: '/tutors', label: 'Find Tutors' },
              { href: '/bookings', label: 'My Bookings' },
              { href: '/messages', label: 'Messages' },
              { href: '/about', label: 'About Us' },
              { href: '/contact', label: 'Contact' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-primary-600 hover:text-primary-700 hover:underline transition text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded px-2 py-1"
              >
                {label}
              </Link>
            ))}
          </div>
        </section>

        {/* Support Section */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-slate-900 mb-2">Need Help?</h3>
          <p className="text-sm text-slate-600 mb-4">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded px-2 py-1"
          >
            Contact Support
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 mb-8 text-center text-xs text-slate-400">
        <p>Error Code: 404 | {new Date().toLocaleDateString()}</p>
      </footer>
    </div>
  );
}

/**
 * Log 404 page view to backend
 */
async function logPageNotFound(data: {
  path: string;
  referrer: string;
  timestamp: string;
}) {
  try {
    await fetch('/api/logs/404', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => {
      // Silent fail - don't break the page if logging fails
    });
  } catch (error) {
    console.error('Failed to log 404:', error);
  }
}

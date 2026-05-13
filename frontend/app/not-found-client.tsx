'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

export default function NotFoundClient() {
  const [searchQuery, setSearchQuery] = useState('');

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
      // Log search event
      logSearchQuery(searchQuery);
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
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
    });
  } catch (error) {
    console.error('Failed to log 404:', error);
  }
}

/**
 * Log search query from 404 page
 */
async function logSearchQuery(query: string) {
  try {
    await fetch('/api/logs/404/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Failed to log search:', error);
  }
}

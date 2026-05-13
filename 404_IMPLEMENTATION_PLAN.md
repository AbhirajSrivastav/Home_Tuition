# Comprehensive 404 Handling Strategy

## 1. ROUTE INVENTORY & ANALYSIS

### Frontend Routes (Next.js App Router)
**Current Routes:**
- `/` - Home page
- `/login` - Authentication
- `/signup` - Authentication
- `/dashboard/[role]` - Role-based dashboard (student/tutor/admin)

**Planned Routes (based on project context):**
- `/dashboard/student` - Student dashboard
- `/dashboard/tutor` - Tutor dashboard
- `/dashboard/admin` - Admin dashboard
- `/tutors` - Browse tutors
- `/tutors/[id]` - Tutor profile detail
- `/bookings` - Bookings management
- `/bookings/[id]` - Booking detail
- `/messages` - Messaging/inbox
- `/profile` - User profile
- `/profile/edit` - Edit profile
- `/search` - Search results
- `/settings` - User settings
- `/about` - Static page
- `/contact` - Contact page
- `/privacy` - Static page
- `/terms` - Static page

**Routes Not Found:**
- Any route not explicitly defined
- Malformed URLs
- Deleted/archived content

### Backend API Routes (Express)
**Current Routes:**
- `GET /api/health` - Health check

**Planned Routes:**
- `POST /api/auth/login` - Login endpoint
- `POST /api/auth/signup` - Register endpoint
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user
- `GET /api/tutors` - List tutors
- `GET /api/tutors/:id` - Get tutor
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking
- `GET /api/messages` - List messages
- `POST /api/messages` - Send message

**404 Scenarios:**
- Non-existent `/api/*` endpoints
- Invalid resource IDs (e.g., `/api/tutors/invalid-id`)
- Deleted resources
- Resources user doesn't have access to (distinguish 404 vs 403)

---

## 2. UNIFIED 404 PAGE DESIGN

### Design Principles
- **Clarity**: Clear messaging explaining what went wrong
- **Helpful**: Suggest next steps and navigation options
- **Brand Consistency**: Match app's design system
- **Accessibility**: WCAG 2.1 AA compliant
- **Responsive**: Mobile-first, works on all devices
- **Fast**: Pre-rendered, no external dependencies

### Component Structure
```
404 Page
├── Header/Navigation (consistent with app)
├── 404 Content Section
│   ├── Large "404" display with icon
│   ├── Headline: "Page Not Found"
│   ├── Description text
│   ├── Search box (optional)
│   └── Action buttons
├── Suggested Navigation
│   ├── Quick links to main sections
│   ├── Site map
│   └── Contact support
└── Footer
```

### Content Strategy
- **Headline**: "Oops! This page doesn't exist"
- **Description**: "The page you're looking for might have been moved, deleted, or doesn't exist."
- **Search**: "Try searching for what you need"
- **Navigation**: Links to Home, Dashboard, Browse Tutors, Contact
- **Support**: "Can't find what you're looking for? Contact our support team"

---

## 3. ROUTING STRATEGY

### Frontend Strategy (Next.js)
**Option A: Catch-All Route (Recommended)**
- Create `app/not-found.tsx` - Built-in Next.js 404 page
- Create `app/[...notfound]/page.tsx` - Catch-all route for granular control
- **Pros**: Works with ISR/SSG, automatic rendering, best performance
- **Cons**: Less customizable than route-based approach

**Option B: Dynamic Catch-All Route**
- Use `app/[...notfound]/page.tsx` for all undefined routes
- Pros: Full control, custom logic per route pattern
- Cons: Requires manual routing logic

**Recommended Approach: Hybrid**
1. Use Next.js `not-found.tsx` for automatic routing
2. Optional `[...slug]/page.tsx` for custom fallback logic
3. Implements `notFound()` function in route handlers

### Backend Strategy (Express)
**Global 404 Handler**
```
1. Route-specific handlers (return 404 for not found)
2. Global error middleware (catches all unmatched routes)
3. Custom 404 JSON response with helpful metadata
```

**Backend 404 Response**
```json
{
  "error": {
    "message": "Not Found",
    "code": "NOT_FOUND",
    "statusCode": 404,
    "path": "/api/invalid",
    "timestamp": "2026-05-13T10:00:00Z",
    "requestId": "req-123-uuid"
  }
}
```

### Fallback Behavior
1. **Server-side**: Pre-rendered 404 page (fastest)
2. **Client-side**: React error boundary catches routing errors
3. **API failures**: Return JSON with helpful error info
4. **Redirect chain**: Implement redirect strategy for moved content
5. **Soft 404s**: Track redirect paths for analytics

---

## 4. ACCESSIBILITY REQUIREMENTS

### ARIA Implementation
```tsx
// 404 Page Structure
<main role="main" aria-label="404 Error Page">
  <section aria-label="Error Details">
    <h1 aria-level="1">Page Not Found</h1>
    <p role="status">This page could not be found.</p>
  </section>
  
  <section aria-label="Navigation Options">
    <nav aria-label="Suggested Navigation">
      <ul role="navigation">
        {/* Links */}
      </ul>
    </nav>
  </section>
</main>
```

### Focus Management
- Focus trap: Loop focus within modal (if modal-based 404)
- Return focus: After navigation, move focus to main content
- Skip links: "Skip to main content", "Skip to search"

### Color & Contrast
- ✅ WCAG AA: 4.5:1 contrast ratio for normal text
- ✅ WCAG AA: 3:1 contrast ratio for UI components
- ❌ Don't rely on color alone to convey "error"
- Use text + icon + color combination

### Text Readability
- Readable font sizes (min 16px on mobile)
- Clear line-height (1.5-1.8)
- Avoid jargon, use plain language
- Provide context: "The product you're looking for is no longer available"

### Keyboard Navigation
- All interactive elements keyboard accessible
- Tab order logical and predictable
- No keyboard traps
- Clear focus indicators (outline, underline, etc.)

### Screen Reader Support
```html
<!-- Proper heading hierarchy -->
<h1>Page Not Found</h1>
<p>Helpful description</p>

<!-- Use aria-label for icon-only buttons -->
<button aria-label="Return to home page">
  <HomeIcon />
</button>

<!-- Use aria-live for dynamic updates -->
<div aria-live="polite" aria-atomic="true">
  Search results loading...
</div>
```

---

## 5. ERROR LOGGING & ANALYTICS

### Logging Strategy
```
Log 404 Events:
├── Timestamp
├── Request Path
├── Referrer (where user came from)
├── User ID (if logged in)
├── Device/Browser info
├── Search query (if applicable)
└── Resolution (did user find what they needed?)
```

### Analytics Events
1. **404 Viewed**: User lands on 404 page
   - Properties: path, referrer, user_type (logged_in/guest)
   
2. **404 Search Used**: User searches from 404 page
   - Properties: query, results_count, clicked_result
   
3. **404 Navigation**: User clicks link from 404 page
   - Properties: link_destination, link_type
   
4. **404 Support Contacted**: User reaches out for help
   - Properties: support_channel, issue_type

### Reporting
```
Dashboard Metrics:
- Top 404 paths (identify broken links)
- Top referrers (where users come from before 404)
- Search patterns on 404 page
- User segment analysis (by role, device, etc.)
- Conversion from 404 (did they find alternative content?)
```

### Implementation
```typescript
// Log to external service
logEvent('404_viewed', {
  path: req.pathname,
  referrer: document.referrer,
  userId: currentUser?.id,
  timestamp: new Date().toISOString(),
  userAgent: navigator.userAgent,
});

// Use service like: Sentry, LogRocket, Google Analytics, Posthog
```

---

## 6. IMPLEMENTATION GUIDANCE

### Next.js Implementation

#### A. Built-in not-found.tsx
```typescript
// app/not-found.tsx
import Link from 'next/link';
import { ArrowLeft, Home, Search, MessageSquare } from 'lucide-react';

export const metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-gradient-to-br from-slate-50 to-white">
      {/* Main Content */}
      <main role="main" aria-label="404 Error Page" className="text-center max-w-lg w-full">
        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-2">404</h1>
          <div className="h-1 w-20 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full"></div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Oops! Page Not Found
        </h2>

        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>

        {/* Search Box */}
        <div className="mb-12">
          <form className="flex gap-2 mb-4">
            <input
              type="search"
              placeholder="Search for courses, tutors..."
              aria-label="Search the site"
              className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
            >
              <Search size={20} />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>
        </div>

        {/* Navigation Buttons */}
        <nav
          aria-label="Suggested Navigation"
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
          >
            <Home size={20} />
            Go to Home
          </Link>

          <Link
            href="/tutors"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-primary-600 hover:text-primary-600 transition font-medium"
          >
            Browse Tutors
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-primary-600 hover:text-primary-600 transition font-medium"
          >
            <MessageSquare size={20} />
            Contact Support
          </Link>
        </nav>

        {/* Sitemap */}
        <section
          aria-label="Quick Navigation Links"
          className="border-t border-slate-200 pt-12"
        >
          <p className="text-sm text-slate-600 mb-6 font-medium">QUICK LINKS</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { href: '/', label: 'Home' },
              { href: '/tutors', label: 'Find Tutors' },
              { href: '/about', label: 'About Us' },
              { href: '/bookings', label: 'My Bookings' },
              { href: '/messages', label: 'Messages' },
              { href: '/contact', label: 'Contact' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-primary-600 hover:text-primary-700 hover:underline transition"
              >
                {label}
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer Message */}
      <footer className="mt-16 text-center text-sm text-slate-500">
        <p>
          Can't find what you're looking for?{' '}
          <Link
            href="/contact"
            className="text-primary-600 hover:underline font-medium"
          >
            Contact us
          </Link>
        </p>
      </footer>

      {/* Error Logging */}
      <ErrorTracker path={typeof window !== 'undefined' ? window.location.pathname : ''} />
    </div>
  );
}
```

#### B. Error Tracking Component
```typescript
// app/components/ErrorTracker.tsx
'use client';

import { useEffect } from 'react';

interface ErrorTrackerProps {
  path: string;
}

export function ErrorTracker({ path }: ErrorTrackerProps) {
  useEffect(() => {
    // Log to analytics
    logPageNotFound({
      path,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    });
  }, [path]);

  return null;
}

async function logPageNotFound(data: Record<string, string>) {
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
```

#### C. Error Boundary (for client-side errors)
```typescript
// app/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
    logError({
      error: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <main role="main" className="text-center max-w-lg">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Something Went Wrong
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-primary-600 transition"
          >
            Go Home
          </Link>
        </div>
      </main>
    </div>
  );
}

async function logError(data: Record<string, unknown>) {
  try {
    await fetch('/api/logs/error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Failed to log error:', error);
  }
}
```

### Express Backend Implementation

#### A. Global 404 Handler
```typescript
// backend/src/middleware/errorHandler.ts
import { Express, Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  path?: string;
}

// 404 Not Found middleware
export function notFoundHandler(req: Request, res: Response, NextFunction: NextFunction) {
  const error: ApiError = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  error.code = 'NOT_FOUND';
  error.path = req.originalUrl;

  // Log 404
  console.warn(`[404] ${req.method} ${req.originalUrl}`, {
    referrer: req.get('referrer'),
    userAgent: req.get('user-agent'),
    ip: req.ip,
  });

  res.status(404).json({
    success: false,
    error: {
      message: 'Not Found',
      code: 'NOT_FOUND',
      statusCode: 404,
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
      requestId: req.get('x-request-id') || 'unknown',
    },
  });
}

// Global error handler
export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Log error
  console.error('[ERROR]', {
    message: err.message,
    code: err.code,
    statusCode,
    path: req.originalUrl,
    method: req.method,
    stack: isDevelopment ? err.stack : undefined,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      code: err.code || 'INTERNAL_ERROR',
      statusCode,
      ...(isDevelopment && { stack: err.stack }),
    },
  });
}
```

#### B. App Setup with 404 Handler
```typescript
// backend/src/app.ts (updated)
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';

dotenv.config();

const app: Express = express();

// ============ MIDDLEWARE ============
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(requestLogger);

// ============ ROUTES ============
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// TODO: Add your routes here
// app.use('/api/auth', authRoutes);
// app.use('/api/tutors', tutorRoutes);

// ============ ERROR HANDLERS (ORDER MATTERS) ============
// This MUST come after all other routes
app.use(notFoundHandler);

// This MUST be last
app.use(errorHandler);

export default app;
```

#### C. 404 Logging Route
```typescript
// backend/src/routes/logs.ts
import express, { Request, Response } from 'express';

const router = express.Router();

interface LogPayload {
  path: string;
  referrer?: string;
  timestamp: string;
  userAgent?: string;
}

// Log 404 page views
router.post('/404', (req: Request, res: Response) => {
  const { path, referrer, timestamp, userAgent }: LogPayload = req.body;

  console.info('[404_LOG]', {
    path,
    referrer,
    timestamp,
    userAgent,
    ip: req.ip,
  });

  // TODO: Send to analytics service (e.g., Sentry, LogRocket)
  // analytics.captureEvent('404_viewed', { path, referrer });

  res.json({ success: true, message: '404 event logged' });
});

// Log general errors
router.post('/error', (req: Request, res: Response) => {
  const { error, stack, digest, timestamp } = req.body;

  console.error('[CLIENT_ERROR_LOG]', {
    error,
    digest,
    timestamp,
    ip: req.ip,
  });

  // TODO: Send to error tracking service
  // errorTracker.captureException(new Error(error), { tags: { digest } });

  res.json({ success: true, message: 'Error logged' });
});

export default router;
```

---

## 7. TESTING PLAN

### Unit Tests

#### A. Frontend 404 Page Tests
```typescript
// app/__tests__/not-found.test.tsx
import { render, screen } from '@testing-library/react';
import NotFound from '@/app/not-found';

describe('404 Not Found Page', () => {
  test('renders 404 heading', () => {
    render(<NotFound />);
    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(screen.getByText(/oops/i)).toBeInTheDocument();
  });

  test('displays navigation links', () => {
    render(<NotFound />);
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /browse tutors/i })).toBeInTheDocument();
  });

  test('has accessible structure', () => {
    const { container } = render(<NotFound />);
    const main = container.querySelector('main[role="main"]');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('aria-label');
  });

  test('search input is accessible', () => {
    render(<NotFound />);
    const searchInput = screen.getByPlaceholderText(/search/i);
    expect(searchInput).toHaveAttribute('aria-label');
  });

  test('has proper heading hierarchy', () => {
    const { container } = render(<NotFound />);
    const h1 = container.querySelector('h1');
    const h2 = container.querySelector('h2');
    expect(h1).toBeInTheDocument();
    expect(h2).toBeInTheDocument();
  });
});
```

#### B. Backend 404 Handler Tests
```typescript
// backend/src/__tests__/404Handler.test.ts
import request from 'supertest';
import app from '@/app';

describe('404 Handler', () => {
  test('returns 404 for non-existent route', async () => {
    const res = await request(app).get('/api/non-existent-route');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  test('returns proper error structure', async () => {
    const res = await request(app).get('/api/invalid');
    expect(res.body).toEqual({
      success: false,
      error: expect.objectContaining({
        message: expect.any(String),
        code: 'NOT_FOUND',
        statusCode: 404,
        path: expect.any(String),
        method: 'GET',
        timestamp: expect.any(String),
        requestId: expect.any(String),
      }),
    });
  });

  test('logs 404 events', async () => {
    const spy = jest.spyOn(console, 'warn');
    await request(app).get('/api/invalid-endpoint');
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('[404]'),
      expect.any(Object)
    );
    spy.mockRestore();
  });

  test('logs endpoint receives proper payload', async () => {
    const res = await request(app)
      .post('/api/logs/404')
      .send({
        path: '/tutors/invalid-id',
        referrer: 'https://example.com',
        timestamp: new Date().toISOString(),
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
```

### Integration Tests

#### A. Frontend E2E 404 Tests
```typescript
// e2e/404.spec.ts (using Playwright or Cypress)
import { test, expect } from '@playwright/test';

test.describe('404 Handling', () => {
  test('displays 404 page for non-existent route', async ({ page }) => {
    await page.goto('/non-existent-page');
    await expect(page.locator('h1')).toContainText('404');
  });

  test('user can navigate from 404 page', async ({ page }) => {
    await page.goto('/invalid-route');
    await page.click('text=Go to Home');
    await expect(page).toHaveURL('/');
  });

  test('search functionality works on 404 page', async ({ page }) => {
    await page.goto('/invalid-route');
    await page.fill('input[placeholder*="Search"]', 'algebra');
    await page.click('button[aria-label="Submit search"]');
    // Should navigate to search results or stay on 404 with results
  });

  test('404 page is accessible', async ({ page }) => {
    await page.goto('/invalid-route');
    
    // Check for main landmark
    const main = page.locator('main[role="main"]');
    await expect(main).toBeVisible();

    // Check keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).not.toBe('BODY');
  });

  test('logs 404 event to backend', async ({ page, context }) => {
    // Intercept API calls
    const promise = context.waitForEvent('request', request => 
      request.url().includes('/api/logs/404')
    );

    await page.goto('/not-found-page');
    
    const request = await promise;
    expect(request.method()).toBe('POST');
  });
});
```

#### B. Backend E2E Tests
```typescript
// backend/e2e/404.spec.ts
import request from 'supertest';
import app from '@/app';

describe('404 E2E Tests', () => {
  test('complete 404 flow: access invalid route, get 404, log it', async () => {
    // 1. Access invalid route
    const getRes = await request(app).get('/api/tutors/invalid-uuid');
    expect(getRes.status).toBe(404);

    // 2. Verify error response structure
    expect(getRes.body.error.code).toBe('NOT_FOUND');
    expect(getRes.body.error.requestId).toBeDefined();

    // 3. Log the 404
    const logRes = await request(app)
      .post('/api/logs/404')
      .send({
        path: '/api/tutors/invalid-uuid',
        referrer: 'https://example.com/tutors',
        timestamp: new Date().toISOString(),
      });

    expect(logRes.status).toBe(200);
  });

  test('handles various invalid routes consistently', async () => {
    const invalidRoutes = [
      '/api/nonexistent',
      '/api/tutors/invalid',
      '/api/bookings/123/invalid',
      '/api',
    ];

    for (const route of invalidRoutes) {
      const res = await request(app).get(route);
      expect(res.status).toBe(404);
      expect(res.body.error).toBeDefined();
    }
  });
});
```

### Manual Testing Checklist

```markdown
## 404 Manual Testing Checklist

### Frontend
- [ ] Visit non-existent page, 404 displays
- [ ] All links on 404 page work
- [ ] Search box on 404 page works
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Screen reader announces content properly
- [ ] Mobile responsive (test on mobile device/emulator)
- [ ] Colors have sufficient contrast
- [ ] No console errors
- [ ] Analytics event fires

### Backend
- [ ] GET /api/invalid returns 404
- [ ] Error response has correct structure
- [ ] Error response has requestId
- [ ] POST /api/logs/404 accepts payload
- [ ] 404 endpoints are logged
- [ ] Other error codes (400, 500) still work
- [ ] CORS headers present
- [ ] Content-Type correct

### Analytics
- [ ] 404 page views tracked
- [ ] Search queries on 404 tracked
- [ ] Navigation from 404 tracked
- [ ] Dashboard shows 404 metrics
- [ ] Top 404 paths identified

### Cross-browser
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
```

---

## 8. IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1)
1. ✅ Create Next.js `not-found.tsx`
2. ✅ Add Express error middleware
3. ✅ Create error logging endpoints
4. ✅ Add basic unit tests

### Phase 2: Enhancement (Week 2)
5. ✅ Add search functionality
6. ✅ Implement analytics tracking
7. ✅ Add error boundary
8. ✅ Add integration tests

### Phase 3: Polish (Week 3)
9. ✅ Accessibility audit
10. ✅ Performance optimization
11. ✅ E2E tests
12. ✅ Documentation

### Phase 4: Monitoring (Ongoing)
13. ✅ Set up error tracking (Sentry)
14. ✅ Configure analytics dashboards
15. ✅ Weekly 404 reports
16. ✅ Fix broken links

---

## 9. STACK-SPECIFIC IMPLEMENTATIONS

### Next.js (Current Stack)
**File Structure:**
```
app/
  ├── not-found.tsx (built-in 404)
  ├── error.tsx (error boundary)
  ├── components/
  │   └── ErrorTracker.tsx
  └── (protected)/
      └── [not found handled by parent]

api/
  ├── logs/
  │   ├── 404.ts
  │   └── error.ts
```

**Key Features:**
- Automatic 404 rendering with `notFound()`
- Pre-rendered for maximum speed
- ISR compatible
- Built-in error boundary

### React Router Comparison
```typescript
// If you were using React Router
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/tutors/:id" element={<TutorDetail />} />
  <Route path="*" element={<NotFound />} /> {/* Catch-all */}
</Routes>
```

### Vue Router Comparison
```javascript
// If you were using Vue Router
{
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('@/views/NotFound.vue'),
}
```

---

## 10. BEST PRACTICES & ANTI-PATTERNS

### ✅ DO
- [ ] Show friendly, helpful 404 pages
- [ ] Log all 404 events with context
- [ ] Provide clear navigation options
- [ ] Make 404 accessible (WCAG AA)
- [ ] Use semantic HTML
- [ ] Cache 404 pages for performance
- [ ] Differentiate 404 from other errors
- [ ] Test 404 page regularly
- [ ] Monitor 404 trends

### ❌ DON'T
- [ ] Show generic browser 404 (use custom page)
- [ ] Use only color to indicate error
- [ ] Create 404 page without navigation
- [ ] Ignore accessibility in 404
- [ ] Log 404s with no aggregation
- [ ] Make 404 page load slowly
- [ ] Confuse 404 with 403 (forbidden)
- [ ] Ignore 404 metrics
- [ ] Redirect all 404s to homepage

---

## 11. REFERENCES & RESOURCES

### External Resources
- [MDN: HTTP 404](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Next.js not-found Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)
- [Google Analytics Events](https://support.google.com/analytics/answer/9322688)

### Tools
- **Error Tracking**: Sentry, LogRocket, Bugsnag
- **Analytics**: Google Analytics, PostHog, Mixpanel
- **Testing**: Jest, Playwright, Cypress
- **Accessibility**: axe DevTools, WAVE, Lighthouse

---

## Next Steps
1. Choose integration approach (built-in vs custom)
2. Implement based on Phase 1 roadmap
3. Add tests
4. Set up analytics
5. Monitor and iterate


# 404 Handling Implementation Guide

## Quick Start (5 minutes)

### For Next.js Frontend
1. ✅ Copy `frontend/app/not-found.tsx` - Already created
2. ✅ Copy `frontend/app/error.tsx` - Already created
3. Add to your pages to trigger 404:
```typescript
// In any route handler
import { notFound } from 'next/navigation';

export default function Page() {
  const data = fetchData(); // If undefined, call notFound()
  if (!data) notFound();
}
```

### For Express Backend
1. ✅ Copy `backend/src/middleware/errorHandler.ts` - Already created
2. ✅ Copy `backend/src/routes/logs.ts` - Already created
3. ✅ Update `backend/src/app.ts` - Already updated
4. Install uuid dependency:
```bash
npm install uuid
npm install --save-dev @types/uuid
```

---

## Detailed Setup Guide

### Frontend Setup

#### Step 1: Understand the 404 Page Structure
The `not-found.tsx` file includes:
- **Hero Section**: Large 404 display with friendly messaging
- **Search Box**: Let users search for what they need
- **Navigation Buttons**: Primary CTAs (Home, Browse Tutors, Contact)
- **Quick Links**: Sitemap-style navigation
- **Support Section**: Help users contact support
- **Analytics**: Tracks 404 page views

#### Step 2: Customize 404 Page Content
Edit `frontend/app/not-found.tsx`:

```typescript
// Change headline
<h1 className="text-4xl font-bold text-slate-900 mb-4">
  Page Not Found  // Change this
</h1>

// Add/remove quick links
{[
  { href: '/', label: 'Home' },
  // Add more links here
].map(({ href, label }) => (
  <Link key={href} href={href} className="...">
    {label}
  </Link>
))}
```

#### Step 3: Add Error Boundary
The `error.tsx` file is Next.js's error boundary. It catches runtime errors:
- Only modify if you want custom error UI
- Keep error details visible in development mode

#### Step 4: Trigger 404 in Your Routes
Use Next.js's `notFound()` function:

```typescript
// pages/tutors/[id]/page.tsx
import { notFound } from 'next/navigation';

export default function TutorDetail({ params }: { params: { id: string } }) {
  const tutor = fetchTutor(params.id);
  
  if (!tutor) {
    notFound(); // Renders your custom not-found.tsx
  }

  return <div>{tutor.name}</div>;
}
```

#### Step 5: Test Frontend 404
```bash
cd frontend
npm run dev

# Visit non-existent page
open http://localhost:3000/non-existent-page
```

---

### Backend Setup

#### Step 1: Install Dependencies
```bash
cd backend
npm install uuid
npm install --save-dev @types/uuid
```

#### Step 2: Review Error Middleware
The `middleware/errorHandler.ts` provides:
- `requestIdMiddleware`: Adds unique ID to each request
- `notFoundHandler`: Catches 404s
- `errorHandler`: Global error handler
- Helper functions for creating API errors

#### Step 3: Verify App Configuration
`backend/src/app.ts` now includes:
```typescript
// Security & parsing
app.use(requestIdMiddleware);
app.use(helmet());
app.use(cors(...));
app.use(express.json());

// Routes
app.use('/api/logs', logsRouter); // Logging endpoints

// Error handlers (MUST be last)
app.use(notFoundHandler);      // 404 handler
app.use(errorHandler);          // Global error handler
```

**Important**: Error handlers must be placed AFTER all routes.

#### Step 4: Test Backend 404
```bash
cd backend
npm run dev

# In another terminal
curl http://localhost:5000/api/invalid

# Expected response:
{
  "success": false,
  "error": {
    "message": "Not Found",
    "code": "NOT_FOUND",
    "statusCode": 404,
    "path": "/api/invalid",
    "method": "GET",
    "timestamp": "2026-05-13T10:00:00.000Z",
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

#### Step 5: View Logging Endpoints
```bash
# Log a 404 page view
curl -X POST http://localhost:5000/api/logs/404 \
  -H "Content-Type: application/json" \
  -d '{
    "path": "/invalid-page",
    "referrer": "https://example.com",
    "timestamp": "2026-05-13T10:00:00Z"
  }'

# Log an error
curl -X POST http://localhost:5000/api/logs/error \
  -H "Content-Type: application/json" \
  -d '{
    "message": "User clicked invalid button",
    "timestamp": "2026-05-13T10:00:00Z"
  }'

# Check logging service health
curl http://localhost:5000/api/logs/health
```

---

## Advanced Configuration

### 1. Environment Variables
Add to `.env`:
```env
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
SENTRY_DSN=https://your-key@sentry.io/project
LOG_LEVEL=info
```

### 2. Custom Error Codes
Extend `ApiError` interface:
```typescript
// middleware/errorHandler.ts
export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  metadata?: {
    resourceId?: string;
    userId?: string;
  };
}
```

### 3. Soft 404 Detection
Implement to detect common typos:
```typescript
// routes/middleware.ts
export function softNotFoundDetector(req: Request, res: Response, next: NextFunction) {
  const path = req.path;
  
  // Detect common misspellings
  if (path.includes('tutors') && path.includes('invalid')) {
    // Log as soft 404 instead of hard 404
    console.warn('[SOFT_404]', path);
  }
  
  next();
}
```

### 4. Analytics Integration
Send logs to external service:
```typescript
// routes/logs.ts
async function logPageNotFound(data: LogData) {
  // Option 1: Sentry
  if (process.env.SENTRY_DSN) {
    Sentry.captureMessage('404 Page View', { extra: data });
  }
  
  // Option 2: Google Analytics
  if (process.env.GA_ID) {
    analytics.event('404_view', data);
  }
  
  // Option 3: Custom database
  await LogModel.create(data);
}
```

---

## Monitoring & Maintenance

### 1. 404 Dashboard
Create metrics for:
- Top 404 paths (identify broken links)
- 404 trends over time
- Referrers (where users come from)
- User segments (logged-in vs guest)

### 2. Fix Broken Links
```typescript
// Redirect common 404s to new locations
app.get('/old-path', (req, res) => {
  res.redirect(301, '/new-path');
});
```

### 3. Monitor API 404s
```bash
# Watch logs for 404 patterns
tail -f logs/app.log | grep "\[404_NOT_FOUND\]"
```

---

## Testing

### Run Unit Tests
```bash
# Frontend
cd frontend
npm run test not-found.test.tsx

# Backend  
cd backend
npm run test errorHandler.test.ts
```

### Run E2E Tests
```bash
# Frontend (Playwright)
cd frontend
npm run test:e2e e2e/404.spec.ts

# Or with Cypress
npm run cypress:open
# Navigate to e2e/404.spec.ts
```

### Manual Testing Checklist
```markdown
## 404 Manual Test Checklist

### Page Display
- [ ] Navigate to /non-existent-page
- [ ] See 404 message and helpful content
- [ ] Page loads within 2 seconds
- [ ] No console errors

### Navigation
- [ ] Home link works
- [ ] Browse Tutors link works
- [ ] Contact link works
- [ ] All quick links work

### Search
- [ ] Search box accepts input
- [ ] Search button is clickable
- [ ] Pressing Enter submits search
- [ ] Search navigates to results

### API
- [ ] GET /api/invalid returns 404
- [ ] POST /api/logs/404 accepts logs
- [ ] Request includes X-Request-ID header
- [ ] Error response has correct structure

### Mobile
- [ ] Test on iPhone SE (375px)
- [ ] Test on iPad (768px)
- [ ] Test on Android phone

### Accessibility
- [ ] Tab through all elements
- [ ] Focus indicators visible
- [ ] Screen reader reads content
- [ ] Color contrast sufficient
- [ ] No keyboard traps

### Browser Compatibility
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari
```

---

## Troubleshooting

### Issue: 404 Page Not Rendering
**Solution**: Ensure you're using Next.js App Router (`app/` directory), not Pages Router.

```bash
# Check your project structure
ls -la app/
# Should show: layout.tsx, page.tsx, not-found.tsx
```

### Issue: Error Handler Not Catching Errors
**Solution**: Ensure error handlers are placed LAST in middleware chain.

```typescript
// ❌ WRONG
app.use(errorHandler);
app.use('/api/users', usersRouter); // Won't be caught

// ✅ CORRECT
app.use('/api/users', usersRouter);
app.use(errorHandler); // Last middleware
```

### Issue: Request ID Missing
**Solution**: Ensure `requestIdMiddleware` is first middleware.

```typescript
// ❌ WRONG
app.use(cors());
app.use(requestIdMiddleware); // Too late

// ✅ CORRECT
app.use(requestIdMiddleware); // First
app.use(cors());
```

### Issue: Analytics Not Logging
**Solution**: Check network tab in browser DevTools.

```bash
# Frontend (browser console)
fetch('/api/logs/404', {
  method: 'POST',
  body: JSON.stringify({ path: window.location.pathname })
})

# Backend logs
tail -f logs/app.log | grep "404"
```

### Issue: CORS Errors with 404 Logging
**Solution**: Ensure CORS allows the logging endpoint.

```typescript
// app.ts
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

---

## Performance Optimization

### 1. Cache 404 Page
```typescript
// next.config.ts
export const revalidate = 86400; // Cache for 24 hours
```

### 2. Pre-render 404 Page
```bash
# In next.config.ts
const config: NextConfig = {
  staticPageGenerationTimeout: 60,
};
```

### 3. Compress Error Responses
```typescript
// app.ts
import compression from 'compression';
app.use(compression());
```

### 4. Rate Limit 404 Logging
```typescript
import rateLimit from 'express-rate-limit';

const logLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
});

app.post('/api/logs/404', logLimiter, (req, res) => {
  // Handle log
});
```

---

## Security Considerations

### 1. Prevent Information Disclosure
```typescript
// ❌ DON'T expose internal paths
res.json({ path: '/internal/admin/users' });

// ✅ DO mask or redact
res.json({ path: '/api/not-found' });
```

### 2. Sanitize User Input in URLs
```typescript
// 404 page properly escapes path
const path = new URL(window.location).pathname;
// Not directly used in innerHTML
```

### 3. Rate Limit 404 Requests
```typescript
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per 15 minutes
});

app.use('/api/', apiLimiter);
```

### 4. Log Sensitive Data Carefully
```typescript
// ❌ DON'T log passwords, tokens
console.log(req.body); // Contains user data

// ✅ DO log only necessary info
console.log({
  method: req.method,
  path: req.path,
  statusCode: 404,
});
```

---

## File Structure Summary

```
project/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── not-found.tsx          ← 404 page
│   │   ├── error.tsx              ← Error boundary
│   │   └── __tests__/
│   │       └── not-found.test.tsx
│   └── e2e/
│       └── 404.spec.ts
│
├── backend/
│   ├── src/
│   │   ├── app.ts                 ← Updated with error handlers
│   │   ├── middleware/
│   │   │   └── errorHandler.ts    ← Error middleware
│   │   ├── routes/
│   │   │   └── logs.ts            ← Logging endpoints
│   │   └── __tests__/
│   │       └── errorHandler.test.ts
│   └── package.json               ← Add uuid dependency
│
├── 404_IMPLEMENTATION_PLAN.md     ← Full strategy document
└── 404_IMPLEMENTATION_GUIDE.md    ← This file
```

---

## Next Steps

1. **Immediate** (Today):
   - Deploy 404 page and error handlers
   - Test in development
   - Run unit tests

2. **Short Term** (This week):
   - Set up analytics dashboard
   - Configure error tracking (Sentry)
   - Implement soft 404 detection

3. **Medium Term** (This month):
   - Fix top broken links
   - Optimize 404 page performance
   - Set up automated alerts

4. **Long Term** (Ongoing):
   - Monitor 404 trends
   - Update broken link redirects
   - Iterate on 404 page based on user feedback

---

## Support & Resources

- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [Express Error Handling](https://expressjs.com/en/guide/error-handling.html)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [HTTP 404 Status Code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404)


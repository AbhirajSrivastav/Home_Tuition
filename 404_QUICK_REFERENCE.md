# 404 Handling - Quick Reference

## 📁 Files Created/Modified

### Frontend (Next.js)

#### `app/not-found.tsx` ✅
- **Purpose**: Custom 404 page displayed when route not found
- **Features**: 
  - Search box for user queries
  - Navigation buttons to main sections
  - Quick links/sitemap
  - Error tracking/logging
  - Fully accessible (WCAG AA)
  - Mobile responsive
- **When triggered**:
  ```typescript
  import { notFound } from 'next/navigation';
  notFound(); // Renders this page
  ```
- **Examples**:
  - `/non-existent-page` → Shows 404 page
  - `/tutors/invalid-id` → After checking DB, calls `notFound()`

#### `app/error.tsx` ✅
- **Purpose**: Error boundary for runtime errors
- **Features**:
  - Catches uncaught errors in route handlers
  - Shows retry button
  - Logs to backend
  - Development vs production UI
- **When triggered**:
  - Unhandled promise rejection
  - Rendering error in component
  - Async function throws

#### `app/__tests__/not-found.test.tsx` ✅
- **Purpose**: Unit tests for 404 page
- **Coverage**:
  - Content rendering
  - Navigation links
  - Search functionality
  - Accessibility
  - Error tracking
- **Run**: `npm run test not-found.test.tsx`

#### `e2e/404.spec.ts` ✅
- **Purpose**: End-to-end tests using Playwright/Cypress
- **Coverage**:
  - Full user flow
  - Mobile responsiveness
  - Performance
  - Analytics tracking
- **Run**: `npm run test:e2e 404.spec.ts`

### Backend (Express)

#### `middleware/errorHandler.ts` ✅
- **Purpose**: Central error handling middleware
- **Exports**:
  - `requestIdMiddleware`: Adds UUID to requests
  - `notFoundHandler`: Catches 404s
  - `errorHandler`: Global error handler
  - Helper functions for creating errors
- **Integration**:
  ```typescript
  app.use(requestIdMiddleware); // Must be first
  // ... routes ...
  app.use(notFoundHandler);     // After all routes
  app.use(errorHandler);         // Last
  ```

#### `routes/logs.ts` ✅
- **Purpose**: Logging endpoints for analytics
- **Endpoints**:
  - `POST /api/logs/404` - Log 404 page views
  - `POST /api/logs/error` - Log client errors
  - `POST /api/logs/404/search` - Log searches on 404
  - `POST /api/logs/404/navigation` - Log 404 navigation
  - `GET /api/logs/404/stats` - Get 404 statistics
  - `GET /api/logs/health` - Health check

#### `app.ts` ✅ (Updated)
- **Changes**:
  - Added `requestIdMiddleware`
  - Added error handlers
  - Registered logs routes
  - Proper middleware ordering
- **Structure**:
  ```
  Middleware
    ↓
  Request ID
    ↓
  Security/CORS/Parsing
    ↓
  Routes
    ↓
  Error Handlers (ORDER MATTERS)
  ```

#### `__tests__/errorHandler.test.ts` ✅
- **Purpose**: Unit tests for error handling
- **Coverage**:
  - 404 response structure
  - Error logging
  - Different HTTP methods
  - Middleware integration
- **Run**: `npm run test errorHandler.test.ts`

### Documentation

#### `404_IMPLEMENTATION_PLAN.md` ✅
- **Purpose**: Comprehensive strategy document
- **Sections**:
  - Route inventory
  - 404 page design principles
  - Routing strategy (Next.js & Express)
  - Accessibility requirements
  - Error logging & analytics
  - Implementation code examples
  - Testing plan
  - Stack-specific implementations
  - Best practices

#### `404_IMPLEMENTATION_GUIDE.md` ✅
- **Purpose**: Step-by-step implementation guide
- **Sections**:
  - Quick start (5 minutes)
  - Detailed setup
  - Advanced configuration
  - Monitoring & maintenance
  - Troubleshooting
  - Performance optimization
  - Security considerations
  - File structure summary

#### `404_IMPLEMENTATION_CHECKLIST.md` ✅
- **Purpose**: Actionable checklist organized by phases
- **Phases**:
  1. Foundation setup
  2. Integration & routes
  3. Error logging
  4. Analytics & monitoring
  5. Fix broken links
  6. Performance optimization
  7. Accessibility audit
  8. Security review
  9. Documentation
  10. Deployment
  11. Ongoing maintenance

---

## 🚀 Quick Start

### 1. Install Dependencies (Backend)
```bash
cd backend
npm install uuid
npm install --save-dev @types/uuid
```

### 2. Test Frontend 404
```bash
cd frontend
npm run dev
# Visit: http://localhost:3000/non-existent-page
```

### 3. Test Backend 404
```bash
cd backend
npm run dev
# In another terminal: curl http://localhost:5000/api/invalid
```

### 4. Run Tests
```bash
# Frontend tests
cd frontend
npm run test not-found.test.tsx

# Backend tests
cd backend
npm run test errorHandler.test.ts
```

### 5. Deploy
```bash
git add .
git commit -m "feat: implement comprehensive 404 handling"
git push
# Deploy to staging, test, then production
```

---

## 📊 API Endpoints

### Logging Endpoints (Backend)

#### POST `/api/logs/404`
Log when user lands on 404 page
```bash
curl -X POST http://localhost:5000/api/logs/404 \
  -H "Content-Type: application/json" \
  -d '{
    "path": "/invalid-page",
    "referrer": "https://example.com",
    "timestamp": "2026-05-13T10:00:00Z",
    "userAgent": "Mozilla/5.0..."
  }'
```

#### POST `/api/logs/error`
Log client-side errors
```bash
curl -X POST http://localhost:5000/api/logs/error \
  -H "Content-Type: application/json" \
  -d '{
    "message": "User profile failed to load",
    "stack": "Error: ...",
    "timestamp": "2026-05-13T10:00:00Z"
  }'
```

#### POST `/api/logs/404/search`
Log searches from 404 page
```bash
curl -X POST http://localhost:5000/api/logs/404/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "algebra tutor",
    "resultsCount": 5
  }'
```

#### POST `/api/logs/404/navigation`
Log navigation from 404 page
```bash
curl -X POST http://localhost:5000/api/logs/404/navigation \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "/tutors",
    "linkType": "quick_link"
  }'
```

#### GET `/api/logs/health`
Check logging service health
```bash
curl http://localhost:5000/api/logs/health
```

---

## 🔑 Key Concepts

### Request ID
- Unique identifier for each HTTP request
- Added by `requestIdMiddleware`
- Included in all responses
- Useful for tracing and debugging

### 404 vs Error
- **404**: Route not found (caught by `notFoundHandler`)
- **Error**: Runtime exception (caught by `errorHandler`)
- **Soft 404**: Page exists but content not found (call `notFound()`)

### Middleware Order (CRITICAL)
```typescript
// 1. Middleware that processes requests
app.use(requestIdMiddleware);
app.use(helmet());
app.use(cors());
app.use(express.json());

// 2. Route handlers
app.get('/api/health', ...);
app.use('/api/users', usersRouter);

// 3. Error handlers (MUST be last)
app.use(notFoundHandler);   // Catches unmatched routes
app.use(errorHandler);      // Catches all errors
```

### Next.js `notFound()` Function
```typescript
import { notFound } from 'next/navigation';

// In any route or server component
if (resourceNotFound) {
  notFound(); // Renders app/not-found.tsx
}
```

---

## 📈 Analytics

### What to Track

**404 Page Views**
```typescript
{
  path: '/invalid-page',
  referrer: 'https://google.com',
  timestamp: '2026-05-13T10:00:00Z',
  userId: 'user-123' // if logged in
}
```

**Search Queries on 404**
```typescript
{
  query: 'algebra tutor',
  resultsCount: 5,
  selectedResult: 2 // which result they clicked
}
```

**Navigation from 404**
```typescript
{
  destination: '/tutors',
  linkType: 'quick_link', // or 'button', 'search'
  timeSpentOn404: 45 // seconds
}
```

### Key Metrics

| Metric | Goal | Note |
|--------|------|------|
| 404s per day | < 5% of traffic | Track trend |
| Average search results | > 1 | User finding options |
| Navigation rate | > 80% | Users leaving 404 |
| Bounce rate | < 20% | Users coming back |
| Page load time | < 1s | Performance metric |

---

## ✅ Success Checklist

- [x] 404 page created and styled
- [x] Error boundary implemented
- [x] Error handlers configured
- [x] Logging endpoints ready
- [x] Unit tests written
- [x] E2E tests written
- [ ] **TODO**: Install uuid dependency
- [ ] **TODO**: Run all tests locally
- [ ] **TODO**: Test on different browsers
- [ ] **TODO**: Test on mobile
- [ ] **TODO**: Deploy to staging
- [ ] **TODO**: Deploy to production
- [ ] **TODO**: Monitor in production

---

## 🆘 Common Issues

### 404 page not showing?
- Verify you're using Next.js App Router (`app/` directory)
- Check that `notFound()` is being called
- Ensure `not-found.tsx` is in correct location

### Error handler not catching errors?
- Ensure handlers are LAST in middleware chain
- Check that `next(error)` is being called
- Verify error has proper structure

### Logging not working?
- Check browser DevTools Network tab
- Verify `/api/logs` endpoint is accessible
- Check CORS configuration
- Ensure POST requests are allowed

### Request ID missing?
- Verify `requestIdMiddleware` is first
- Check response headers for `X-Request-ID`
- Ensure middleware is registered

---

## 📚 Resources

**Next.js**
- [Error Handling Docs](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [not-found API](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)

**Express**
- [Error Handling Guide](https://expressjs.com/en/guide/error-handling.html)
- [Middleware Guide](https://expressjs.com/en/guide/using-middleware.html)

**Accessibility**
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

**Testing**
- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/react)

---

## 📞 Support

For questions or issues:
1. Check `404_IMPLEMENTATION_GUIDE.md` Troubleshooting section
2. Review test files for examples
3. Check browser DevTools console for errors
4. Check backend logs for API errors


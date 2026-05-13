# 404 Handling Implementation Checklist

## Phase 1: Foundation Setup ✅ (Ready to Start)

### Frontend (Next.js)
- [x] Create `app/not-found.tsx` - Main 404 page
- [x] Create `app/error.tsx` - Error boundary
- [x] Add error logging component
- [ ] **TODO**: Update `next.config.ts` for ISR/caching
- [ ] **TODO**: Test 404 page locally

### Backend (Express)
- [x] Create `middleware/errorHandler.ts` - Error handling
- [x] Create `routes/logs.ts` - Logging endpoints
- [x] Update `app.ts` - Integrate error handlers
- [ ] **TODO**: Install uuid dependency: `npm install uuid`
- [ ] **TODO**: Test 404 responses with curl
- [ ] **TODO**: Verify request IDs in responses

### Testing
- [x] Create `frontend/app/__tests__/not-found.test.tsx` - Unit tests
- [x] Create `backend/src/__tests__/errorHandler.test.ts` - Unit tests
- [x] Create `frontend/e2e/404.spec.ts` - E2E tests
- [ ] **TODO**: Run: `npm run test` (frontend & backend)
- [ ] **TODO**: Run: `npm run test:e2e` (E2E tests)

---

## Phase 2: Integration & Routes ⏳

### Define Your Routes
- [ ] List all current routes in your app
- [ ] List all planned routes
- [ ] Identify catch-all patterns
- [ ] Plan redirect strategy for moved content

### Frontend Routes to Protect
- [ ] `/login` - Add 404 for invalid auth endpoints
- [ ] `/signup` - Handle invalid registration links
- [ ] `/dashboard/[role]` - Validate role exists
- [ ] `/tutors/[id]` - Validate tutor exists
- [ ] `/bookings/[id]` - Validate booking exists

Example implementation:
```typescript
// pages/tutors/[id]/page.tsx
import { notFound } from 'next/navigation';

export default async function TutorPage({ params }) {
  const tutor = await fetchTutor(params.id);
  if (!tutor) notFound(); // Triggers 404 page
  return <TutorDetail tutor={tutor} />;
}
```

### Backend Routes to Protect
- [ ] `/api/auth/*` - Add validation
- [ ] `/api/tutors/*` - Validate resource IDs
- [ ] `/api/bookings/*` - Validate ownership
- [ ] `/api/messages/*` - Validate access

Example implementation:
```typescript
// routes/tutors.ts
router.get('/:id', async (req, res, next) => {
  const tutor = await Tutor.findById(req.params.id);
  if (!tutor) {
    return next(createApiError('Tutor not found', 404, 'TUTOR_NOT_FOUND'));
  }
  res.json(tutor);
});
```

---

## Phase 3: Error Logging Setup ⏳

### Frontend Logging
- [ ] Verify 404 page logs to `/api/logs/404`
- [ ] Verify error page logs to `/api/logs/error`
- [ ] Verify search queries are logged from 404 page
- [ ] Verify navigation from 404 is tracked

### Backend Logging
- [ ] Test POST `/api/logs/404` endpoint
- [ ] Test POST `/api/logs/error` endpoint
- [ ] Test POST `/api/logs/404/search` endpoint
- [ ] Test POST `/api/logs/404/navigation` endpoint
- [ ] Verify logs are written to file/database
- [ ] Set up log aggregation service (optional):
  - [ ] Sentry for error tracking
  - [ ] LogRocket for session replay
  - [ ] Google Analytics for metrics
  - [ ] DataDog for infrastructure monitoring

### Database/Storage
- [ ] Decide on log storage (file, database, cloud service)
- [ ] Create logs table/collection if using database:
  ```sql
  CREATE TABLE logs (
    id UUID PRIMARY KEY,
    type VARCHAR(50),
    path VARCHAR(255),
    referrer VARCHAR(255),
    timestamp DATETIME,
    user_id UUID,
    ip_address VARCHAR(45)
  );
  ```
- [ ] Set up log retention policy (e.g., 90 days)
- [ ] Create backup strategy for logs

---

## Phase 4: Analytics & Monitoring ⏳

### Dashboard Metrics
- [ ] Total 404s per day/week/month
- [ ] Top 10 404 paths
- [ ] Top 10 referrers leading to 404
- [ ] Search queries from 404 page
- [ ] Top click-through links from 404
- [ ] User segment analysis:
  - [ ] Logged-in vs guest users
  - [ ] By device type
  - [ ] By browser

### Create Reports
- [ ] Weekly 404 report
- [ ] Monthly trending analysis
- [ ] Identify patterns in 404s

Example query:
```sql
SELECT path, COUNT(*) as count
FROM logs
WHERE type = '404_PAGE_VIEW'
  AND timestamp > NOW() - INTERVAL '7 days'
GROUP BY path
ORDER BY count DESC
LIMIT 10;
```

### Set Up Alerts
- [ ] Alert if 404 rate > threshold (e.g., > 5% of traffic)
- [ ] Alert for new 404 paths
- [ ] Alert for spike in 404s for specific path
- [ ] Alert for errors in 404 page itself

---

## Phase 5: Fix Broken Links ⏳

### Audit Existing 404s
- [ ] Export top 404 paths
- [ ] Categorize them:
  - [ ] Deleted pages (redirect or remove from sitemap)
  - [ ] Moved pages (implement redirects)
  - [ ] Typos (check for common patterns)
  - [ ] Security scanning (likely bots - ignore)

### Implement Redirects
```typescript
// app/api/redirects/route.ts
const redirects = [
  { from: '/old-course-path', to: '/new-course-path' },
  { from: '/tutorial-old', to: '/tutorials/new' },
];

export async function GET(req: Request) {
  const path = new URL(req.url).pathname;
  const redirect = redirects.find(r => r.from === path);
  
  if (redirect) {
    return Response.redirect(redirect.to, 301);
  }
  
  return new Response('Not Found', { status: 404 });
}
```

### Fix Issues
- [ ] Update broken internal links in content
- [ ] Remove broken external links or replace with working ones
- [ ] Update navigation menus
- [ ] Update sitemap.xml
- [ ] Update robots.txt

---

## Phase 6: Performance Optimization ⏳

### Frontend Performance
- [ ] Cache 404 page (24+ hours): Set revalidate time
- [ ] Pre-render 404 page as static
- [ ] Measure Core Web Vitals for 404 page:
  - [ ] LCP: < 2.5s ✓
  - [ ] FID/INP: < 100ms ✓
  - [ ] CLS: < 0.1 ✓
- [ ] Compress images on 404 page
- [ ] Minify CSS/JS
- [ ] Enable gzip compression

### Backend Performance
- [ ] Rate limit logging endpoints (optional)
- [ ] Enable response compression (gzip)
- [ ] Cache 404 responses in CDN
- [ ] Optimize 404 query performance

### Monitoring
- [ ] Set up performance alerts
- [ ] Monitor API response times for 404 endpoints
- [ ] Monitor disk space for logs

---

## Phase 7: Accessibility Audit ⏳

### WCAG 2.1 AA Compliance
- [ ] Color contrast ratio >= 4.5:1 for text
- [ ] Color contrast ratio >= 3:1 for UI components
- [ ] Keyboard navigation (Tab, Enter, Esc)
- [ ] Focus indicators visible
- [ ] Screen reader support (ARIA roles, labels)
- [ ] Heading hierarchy correct
- [ ] Form labels associated
- [ ] No keyboard traps

### Test with Tools
- [ ] Run axe-core: `npm run axe /not-found`
- [ ] Run WAVE browser extension
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Manual keyboard-only navigation test

### Fix Issues
- [ ] Add missing aria labels
- [ ] Improve color contrast
- [ ] Fix heading hierarchy
- [ ] Remove keyboard traps

---

## Phase 8: Security Review ⏳

### Data Protection
- [ ] Don't log sensitive data (passwords, tokens)
- [ ] Sanitize user input in error messages
- [ ] Prevent information disclosure in errors
- [ ] Validate and escape all user inputs

### Prevent Attacks
- [ ] Test XSS prevention: Send `<script>alert('xss')</script>` in URL
- [ ] Test SQL injection: Send `' OR '1'='1` in query
- [ ] Test path traversal: Send `../../../etc/passwd`
- [ ] Test SSRF: Send internal IPs/hostnames
- [ ] Implement rate limiting on logging endpoints
- [ ] Add CSRF protection if needed

### Review Code
- [ ] No hardcoded secrets in code
- [ ] No debug info in production
- [ ] Error messages are generic in production
- [ ] Request validation implemented

---

## Phase 9: Documentation ⏳

### Create Documentation
- [ ] Architecture diagram
- [ ] Sequence diagrams (404 flow)
- [ ] API documentation (logging endpoints)
- [ ] Troubleshooting guide
- [ ] Maintenance runbook

### Update Team Docs
- [ ] How to trigger 404 in routes
- [ ] How to track analytics
- [ ] How to interpret 404 reports
- [ ] Escalation procedure for 404 spikes

---

## Phase 10: Deployment ⏳

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] Code reviewed
- [ ] No console errors/warnings
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Backups created

### Deployment Steps
1. [ ] Deploy to staging
2. [ ] Run smoke tests on staging
3. [ ] Verify 404 page rendering
4. [ ] Verify error handling
5. [ ] Check analytics logging
6. [ ] Deploy to production
7. [ ] Monitor for errors
8. [ ] Verify 404 page live
9. [ ] Verify analytics receiving data

### Post-Deployment
- [ ] Monitor error rates
- [ ] Check 404 analytics
- [ ] Collect user feedback
- [ ] Watch for regressions

---

## Phase 11: Ongoing Maintenance ⏳

### Weekly Tasks
- [ ] Review 404 logs (top paths, trends)
- [ ] Check for new 404 spikes
- [ ] Fix broken links found
- [ ] Review error logs for issues

### Monthly Tasks
- [ ] Generate 404 report
- [ ] Analyze patterns
- [ ] Update documentation
- [ ] Optimize based on metrics
- [ ] Review and rotate logs

### Quarterly Tasks
- [ ] Full accessibility audit
- [ ] Performance review
- [ ] Security review
- [ ] Update redirect mapping
- [ ] Archive old logs

### Yearly Tasks
- [ ] Comprehensive 404 strategy review
- [ ] User feedback collection
- [ ] Architecture update if needed
- [ ] Technology/tool evaluation

---

## Priority Items (Start Here)

**Must Complete First**:
- [x] Create 404 page (`not-found.tsx`)
- [x] Create error handlers (`errorHandler.ts`)
- [ ] **Install uuid**: `cd backend && npm install uuid`
- [ ] **Test locally**: Run both frontend and backend
- [ ] **Test 404s**: Visit non-existent routes
- [ ] **Verify logs**: Check /api/logs/404 works

**Complete This Week**:
- [ ] Run unit tests
- [ ] Run E2E tests
- [ ] Fix any test failures
- [ ] Deploy to staging
- [ ] Test on mobile

**Complete This Month**:
- [ ] Set up analytics
- [ ] Fix broken links
- [ ] Accessibility audit
- [ ] Deploy to production
- [ ] Monitor metrics

---

## Success Metrics

### Technical Metrics
- ✅ 404 page renders in < 1 second
- ✅ 404 page accessible (WCAG AA)
- ✅ 100% of 404s logged and tracked
- ✅ 0 errors in 404 page itself
- ✅ 100% tests passing

### Business Metrics
- ✅ < 5% of traffic hits 404
- ✅ > 80% of users navigate from 404 page
- ✅ < 2% bounce rate from 404
- ✅ Top 10 404 paths fixed within 30 days

### User Experience Metrics
- ✅ Users find what they need via search
- ✅ Navigation options are clear
- ✅ Page loads quickly
- ✅ Mobile-friendly layout

---

## Notes

- Update this checklist as you progress
- Check items as you complete them
- Document any blockers or decisions made
- Review quarterly to ensure ongoing maintenance


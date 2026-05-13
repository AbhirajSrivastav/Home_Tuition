# Implementation Guide - Week by Week

**Version**: 1.0  
**For**: Home Tuition MVP Development  
**Timeline**: 10 weeks

---

## Week 1-2: Project Setup & Infrastructure

### Objectives
✅ Set up project structure  
✅ Configure development environment  
✅ Initialize database  
✅ Set up CI/CD pipeline

### Tasks

#### Backend Setup
```bash
# Initialize Express + TypeScript
npm init -y
npm install express typescript ts-node-dev
npm install --save-dev @types/express @types/node

# Create directory structure
mkdir -p src/{routes,middleware,services,models,db,utils}

# Generate tsconfig.json and compile
npx tsc --init
npm run build
```

**Files to Create:**
- [ ] `src/app.ts` - Express app configuration
- [ ] `src/server.ts` - Server entry point
- [ ] `src/db/connection.ts` - Database connection
- [ ] `src/db/schema.ts` - Database initialization
- [ ] `.env.example` - Environment template

#### Frontend Setup
```bash
# Create Next.js project
npx create-next-app@latest frontend --typescript --tailwind

# Install additional dependencies
npm install zustand @tanstack/react-query socket.io-client
```

**Files to Create:**
- [ ] `app/layout.tsx` - Root layout
- [ ] `app/page.tsx` - Home page
- [ ] `lib/api.ts` - API client
- [ ] `store/auth.ts` - Auth store
- [ ] `types/index.ts` - TypeScript types

#### Database Setup
```sql
-- Run schema initialization
npm run migrate

-- Verify tables created
\dt
```

#### CI/CD Setup
**GitHub Actions** (`.github/workflows/`)
- [ ] Test workflow (lint + test on PR)
- [ ] Deploy workflow (deploy on main push)

### Deliverables
- ✅ Project structure complete
- ✅ Development environment working
- ✅ Database initialized
- ✅ Health endpoint working
- ✅ CI/CD pipeline configured

### Success Criteria
- Backend starts without errors: `npm run dev` ✅
- Frontend builds: `npm run build` ✅
- Database connection verified ✅
- All tables created ✅

---

## Week 3-4: Authentication & User Management

### Objectives
✅ User registration (signup)  
✅ Email verification  
✅ User login  
✅ JWT token management  
✅ Password reset flow

### Backend Implementation

#### Auth Route: `src/routes/auth.ts`
```typescript
POST /auth/signup        // Register new user
POST /auth/login         // Login user
POST /auth/refresh       // Refresh access token
POST /auth/logout        // Logout (invalidate tokens)
POST /auth/verify-email  // Verify email address
POST /auth/forgot-password // Send reset email
POST /auth/reset-password // Reset password
```

#### Auth Service: `src/services/authService.ts`
```typescript
// Key functions
- hashPassword(password: string): Promise<string>
- verifyPassword(password: string, hash: string): Promise<boolean>
- generateAccessToken(userId: string, role: string): string
- generateRefreshToken(userId: string): string
- createUser(email, passwordHash, role, name): Promise<User>
- findUserByEmail(email: string): Promise<User | null>
- updatePassword(userId: string, newPassword: string): Promise<void>
```

#### Auth Middleware: `src/middleware/auth.ts`
```typescript
// Middleware functions
- authenticateToken: Verify JWT and attach user to request
- authorize(...roles): Check user role
- validateInput: Validate email, password, etc.
```

#### Database
```sql
-- User table already in schema
-- Add token blacklist table for logout (optional)
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  token VARCHAR(500) UNIQUE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Frontend Implementation

#### Pages
- [ ] `app/(auth)/signup/page.tsx` - Registration form
- [ ] `app/(auth)/login/page.tsx` - Login form
- [ ] `app/(auth)/verify-email/page.tsx` - Email verification
- [ ] `app/(auth)/forgot-password/page.tsx` - Password reset request
- [ ] `app/(auth)/reset-password/page.tsx` - Password reset form

#### Components
- [ ] `components/auth/SignupForm.tsx` - Signup form with validation
- [ ] `components/auth/LoginForm.tsx` - Login form
- [ ] `components/auth/AuthGuard.tsx` - Protected route wrapper

#### Store & Hooks
- [ ] `store/auth.ts` - Auth state management (Zustand)
- [ ] `hooks/useAuth.ts` - Auth hook
- [ ] `hooks/useProtectedRoute.ts` - Route protection hook

### Email Setup (Phase 1 MVP - Optional)
```typescript
// For production, set up Nodemailer
- SMTP_HOST: smtp.gmail.com
- SMTP_PORT: 587
- SMTP_USER: your_email@gmail.com
- SMTP_PASSWORD: app_password
```

### Testing

#### Backend Tests
```bash
# Create tests/auth.test.ts
- Test signup with valid/invalid data
- Test login success and failure
- Test JWT verification
- Test password hashing
- Test email validation
```

#### Frontend Tests
```bash
# Create __tests__/auth.test.tsx
- Test signup form rendering
- Test form validation
- Test login flow
- Test token storage
```

### Deliverables
- ✅ User can signup with email/password
- ✅ Email verification sent (mock for MVP)
- ✅ User can login
- ✅ JWT tokens generated and validated
- ✅ Password reset flow works
- ✅ Protected routes redirect to login
- ✅ Tests passing (80%+ coverage)

### API Testing

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"student@example.com",
    "password":"SecurePass123!",
    "name":"John Doe",
    "role":"student"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"student@example.com",
    "password":"SecurePass123!"
  }'
```

---

## Week 5-6: Tutor Features

### Objectives
✅ Tutor profile creation  
✅ Profile management  
✅ Subject & rate configuration  
✅ Availability management  
✅ Search & filtering  
✅ Tutor listing page

### Backend Implementation

#### Routes: `src/routes/tutors.ts`
```
GET /tutors                      // List all tutors with filters
GET /tutors/:id                  // Get tutor details
POST /tutors                     // Create tutor profile (protected)
PUT /tutors/:id                  // Update profile (protected)
GET /tutors/:id/availability     // Get availability
PUT /tutors/:id/availability     // Update availability (protected)
DELETE /tutors/:id               // Delete profile (protected)
```

#### Services: `src/services/tutorService.ts`
```typescript
- createTutorProfile()
- updateTutorProfile()
- getTutorById()
- searchTutors(filters: TutorFilters)
- setAvailability()
- getAvailability()
- calculateAverageRating()
```

#### Database Operations
```sql
-- Already in schema:
-- tutors table
-- availability table

-- Add search indexes
CREATE INDEX idx_tutors_subjects ON tutors USING GIN(subjects);
CREATE INDEX idx_tutors_rating ON tutors(average_rating DESC);
```

### Frontend Implementation

#### Pages
- [ ] `app/(dashboard)/tutor/profile/page.tsx` - Tutor profile setup
- [ ] `app/(dashboard)/tutor/edit/page.tsx` - Edit profile
- [ ] `app/tutors/page.tsx` - Tutor listing
- [ ] `app/tutors/[id]/page.tsx` - Tutor detail page

#### Components
- [ ] `components/tutor/TutorCard.tsx` - Tutor card component
- [ ] `components/tutor/TutorForm.tsx` - Profile form
- [ ] `components/tutor/AvailabilityCalendar.tsx` - Availability editor
- [ ] `components/tutor/TutorSearch.tsx` - Search/filter component
- [ ] `components/tutor/RatingDisplay.tsx` - Display ratings

#### Hooks & Utilities
- [ ] `hooks/useTutors.ts` - Fetch tutors
- [ ] `hooks/useTutorProfile.ts` - Manage tutor profile
- [ ] `lib/tutorUtils.ts` - Utility functions

### File Upload (Cloudinary)

```typescript
// backend/src/middleware/upload.ts
- multer configuration
- Cloudinary integration
- Image validation

// frontend/lib/uploadUtils.ts
- File validation
- Upload to Cloudinary
- Error handling
```

### Subjects Master Data
```typescript
// constants/subjects.ts
const SUBJECTS = [
  'Math', 'English', 'Science', 'History',
  'Physics', 'Chemistry', 'Biology',
  // ... more subjects
];

// Grade levels
const GRADE_LEVELS = ['K-2', '3-5', '6-8', '9-12', 'College'];
```

### Deliverables
- ✅ Tutor can create profile
- ✅ Profile picture upload works
- ✅ Subject and rate configuration
- ✅ Availability calendar setup
- ✅ Tutor listing page with search
- ✅ Filtering by subject, rate, location
- ✅ Tutor detail page shows ratings
- ✅ Tests passing

### Testing

```bash
# Test endpoints
curl http://localhost:5000/api/tutors
curl http://localhost:5000/api/tutors?subject=Math&minRate=20

# Test profile creation
curl -X POST http://localhost:5000/api/tutors \
  -H "Authorization: Bearer <token>" \
  -d '{...}'
```

---

## Week 7: Booking System

### Objectives
✅ Student booking requests  
✅ Tutor approval/rejection  
✅ Calendar-based booking  
✅ Booking management  
✅ Session status tracking

### Backend Implementation

#### Routes: `src/routes/bookings.ts`
```
POST /bookings                   // Create booking request
GET /bookings                    // List bookings (filtered)
GET /bookings/:id                // Get booking details
PUT /bookings/:id/approve        // Tutor approves booking
PUT /bookings/:id/reject         // Tutor rejects booking
PUT /bookings/:id/cancel         // Cancel booking
PUT /bookings/:id/complete       // Mark completed
```

#### Services: `src/services/bookingService.ts`
```typescript
- createBooking()                // Validate and create
- getBookings()                  // With filtering
- approveBooking()
- rejectBooking()
- cancelBooking()
- completeBooking()
- checkTutorAvailability()       // Verify no conflicts
- calculateTotalCost()
```

#### Validation
```typescript
- Date must be in future
- Time must fall in tutor's availability
- No overlapping bookings
- Duration must be 30-120 minutes
```

#### Database
```sql
-- Already in schema
-- bookings table
-- Add indexes for queries
CREATE INDEX idx_bookings_student_date 
  ON bookings(student_id, session_date DESC);
```

### Frontend Implementation

#### Pages
- [ ] `app/(dashboard)/student/bookings/page.tsx` - Student bookings
- [ ] `app/(dashboard)/tutor/bookings/page.tsx` - Tutor bookings
- [ ] `app/tutors/[id]/book/page.tsx` - Booking flow

#### Components
- [ ] `components/booking/BookingCalendar.tsx` - Calendar picker
- [ ] `components/booking/BookingForm.tsx` - Booking form
- [ ] `components/booking/BookingCard.tsx` - Booking card
- [ ] `components/booking/BookingStatus.tsx` - Status badge
- [ ] `components/booking/TimeSlotPicker.tsx` - Time selection

#### Hooks
- [ ] `hooks/useBooking.ts` - Booking operations
- [ ] `hooks/useBookingList.ts` - Fetch bookings

### Calendar Integration
```typescript
// Use date-fns for date manipulation
import { format, addDays, setHours, setMinutes } from 'date-fns';

// Time slot generation
- Get tutor availability
- Generate 30-min slots
- Filter out booked times
- Display available slots
```

### Notifications (Phase 1 - Toast only)
```typescript
// Use react-hot-toast
import toast from 'react-hot-toast';

- Booking requested
- Booking approved
- Booking rejected
- Booking cancelled
```

### Deliverables
- ✅ Student can request booking
- ✅ Calendar shows available times
- ✅ Tutor can approve/reject
- ✅ Both can cancel with reason
- ✅ Status tracking works
- ✅ Validation prevents conflicts
- ✅ Toast notifications for actions

### Testing

```bash
# Create booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer <token>" \
  -d '{
    "tutorId":"...",
    "sessionDate":"2026-05-20",
    "startTime":"14:00",
    "duration":60,
    "subject":"Math"
  }'

# Approve booking
curl -X PUT http://localhost:5000/api/bookings/123/approve \
  -H "Authorization: Bearer <token>"
```

---

## Week 8: Messaging & Reviews

### Objectives
✅ Real-time messaging  
✅ Conversation management  
✅ Review system  
✅ Rating calculation  
✅ Notifications

### Backend Implementation

#### WebSocket Setup: Socket.io
```typescript
// src/socket.ts
- Configure Socket.io
- Handle connection/disconnection
- Emit/receive messages
- User authentication
```

#### Routes: `src/routes/messages.ts`
```
GET /conversations              // List conversations
POST /conversations             // Start conversation
GET /messages/:conversationId   // Get messages
POST /messages                  // Send message
```

#### Routes: `src/routes/reviews.ts`
```
POST /reviews                   // Create review (protected)
GET /reviews/tutor/:tutorId     // Get tutor reviews
DELETE /reviews/:id             // Delete review (protected)
```

#### Services
```typescript
// messagesService.ts
- getConversations()
- createConversation()
- getMessages()
- sendMessage()
- markAsRead()

// reviewService.ts
- createReview()               // Only after completed booking
- getReviewsByTutor()
- deleteReview()
- updateAverageRating()        // Recalculate tutor rating
```

#### Socket Events
```typescript
// Server emits
'message:new'                   // New message
'message:read'                  // Message read
'user:typing'                   // User typing indicator
'conversation:updated'          // Conversation updated

// Client emits
'message:send'                  // Send message
'message:read'                  // Mark read
'user:typing'                   // Typing status
```

### Frontend Implementation

#### Pages
- [ ] `app/(dashboard)/messages/page.tsx` - Conversations list
- [ ] `app/(dashboard)/messages/[id]/page.tsx` - Chat page

#### Components
- [ ] `components/messaging/ConversationList.tsx` - Conversations
- [ ] `components/messaging/ChatWindow.tsx` - Chat interface
- [ ] `components/messaging/MessageBubble.tsx` - Message display
- [ ] `components/messaging/TypingIndicator.tsx` - Typing status
- [ ] `components/review/ReviewForm.tsx` - Review submission
- [ ] `components/review/ReviewCard.tsx` - Display review
- [ ] `components/review/RatingStars.tsx` - Star rating

#### Socket.io Integration
```typescript
// hooks/useSocket.ts
- Connect to Socket.io
- Handle connection
- Listen to events
- Emit events

// hooks/useChat.ts
- Get conversations
- Send message
- Mark as read
- Real-time updates
```

### Review Validation
```typescript
- Must have completed booking
- One review per booking
- Rating 1-5 only
- Comment max 500 chars
- Cannot review own booking (if tutor)
```

### Deliverables
- ✅ Real-time messaging works
- ✅ Conversation list displays
- ✅ Typing indicator shows
- ✅ Messages persist in DB
- ✅ Can leave reviews
- ✅ Ratings calculate correctly
- ✅ Reviews display on profile
- ✅ Cannot review uncompleted bookings

### Testing

```bash
# Send message (HTTP - for testing)
curl -X POST http://localhost:5000/api/messages \
  -H "Authorization: Bearer <token>" \
  -d '{
    "conversationId":"...",
    "text":"Hi, when can we meet?"
  }'

# Create review
curl -X POST http://localhost:5000/api/reviews \
  -H "Authorization: Bearer <token>" \
  -d '{
    "tutorId":"...",
    "bookingId":"...",
    "rating":5,
    "comment":"Great tutor!"
  }'
```

---

## Week 9: Admin & Dashboards

### Objectives
✅ Role-based dashboards  
✅ Student dashboard  
✅ Tutor dashboard  
✅ Admin panel (basic)  
✅ Analytics views

### Backend Routes

#### Admin Routes: `src/routes/admin.ts`
```
GET /admin/stats                 // Platform statistics
GET /admin/users                 // List all users
GET /admin/bookings              // List all bookings
PUT /admin/users/:id/status      // Enable/disable user
DELETE /admin/reviews/:id        // Remove review
```

### Frontend Implementation

#### Student Dashboard: `app/(dashboard)/student/page.tsx`
```
Components:
- Stats card (upcoming bookings, total hours)
- Upcoming sessions list
- Recent tutors
- Favorite tutors
- Booking history
- Messages shortcut
```

#### Tutor Dashboard: `app/(dashboard)/tutor/page.tsx`
```
Components:
- Stats card (total bookings, earnings, rating)
- Pending booking requests
- Upcoming sessions
- Recent reviews
- Performance metrics
- Availability status
```

#### Admin Dashboard: `app/(dashboard)/admin/page.tsx` (Phase 2 - MVP minimal)
```
Components:
- Total users stats
- Total bookings stats
- Platform earnings
- Recent activity
- User management table
```

### Pages
- [ ] `app/(dashboard)/student/page.tsx` - Student home
- [ ] `app/(dashboard)/student/bookings/history/page.tsx` - Booking history
- [ ] `app/(dashboard)/student/tutors/favorites/page.tsx` - Favorite tutors
- [ ] `app/(dashboard)/tutor/page.tsx` - Tutor home
- [ ] `app/(dashboard)/tutor/analytics/page.tsx` - Tutor analytics
- [ ] `app/(dashboard)/admin/page.tsx` - Admin dashboard (basic)

### Components
- [ ] `components/dashboard/StatsCard.tsx` - Stats display
- [ ] `components/dashboard/SessionCard.tsx` - Session preview
- [ ] `components/dashboard/UpcomingList.tsx` - Upcoming sessions
- [ ] `components/dashboard/RecentActivity.tsx` - Activity feed
- [ ] `components/admin/UserTable.tsx` - Admin users table

### Deliverables
- ✅ Student sees bookings and tutors
- ✅ Tutor sees pending requests and schedule
- ✅ Basic admin panel for user management
- ✅ Stats calculated correctly
- ✅ Role-based access control working
- ✅ Analytics displayed (basic)

---

## Week 10: Testing, Optimization & Launch

### Objectives
✅ End-to-end testing  
✅ Performance optimization  
✅ Security audit  
✅ Documentation complete  
✅ Production deployment

### Testing

#### Unit Tests
```bash
# Backend
npm test -- --coverage

# Frontend
npm run test:coverage
```

Target: 80% coverage of critical paths

#### Integration Tests
```bash
# Test auth flow
- Signup → Email verify → Login → Access protected route

# Test booking flow
- Create profile → Search tutors → Book → Approve → Complete → Review

# Test messaging
- Create conversation → Send message → Receive → Mark read
```

#### E2E Tests (Cypress/Playwright)
```bash
# Critical user journeys
- Student signup and first booking
- Tutor profile setup and approval
- Complete booking and review
```

### Performance Optimization

#### Frontend
```
- Enable code splitting
- Optimize images
- Lazy load components
- Cache with SWR/TanStack Query
- Minify bundle

Target:
- Lighthouse: 90+
- FCP: <1.5s
- LCP: <2.5s
```

#### Backend
```
- Add database indexes
- Implement connection pooling
- Cache popular queries
- Optimize N+1 queries
- Monitor response times

Target:
- API response: <200ms (p99)
- DB queries: <50ms
```

### Security Audit

Checklist:
```
- [ ] All inputs validated (Zod)
- [ ] SQL injection prevented (parameterized)
- [ ] XSS prevention (sanitization)
- [ ] CSRF tokens implemented
- [ ] Rate limiting enabled
- [ ] Secrets not in code
- [ ] HTTPS configured
- [ ] CORS properly configured
- [ ] No sensitive data in logs
- [ ] Dependencies audited (npm audit)
```

### Documentation

Complete:
```
- [x] README.md
- [x] SETUP_GUIDE.md
- [x] API_DOCUMENTATION.md
- [x] PROJECT_PLAN.md
- [x] Architecture docs
- [x] Code comments
- [x] Deployment guide
```

### Deployment

#### Frontend (Vercel)
```bash
# Create Vercel project
# Link GitHub repository
# Set environment variables
# Deploy on push to main
```

#### Backend (Railway/Render)
```bash
# Create Railway/Render project
# Connect GitHub
# Set DATABASE_URL
# Deploy on push to main
```

### Pre-Launch Checklist
```
Testing:
- [ ] Unit tests passing (80%+ coverage)
- [ ] Integration tests passing
- [ ] E2E tests on staging
- [ ] Manual testing checklist complete
- [ ] Security testing done

Performance:
- [ ] Lighthouse score 90+ (FCP <1.5s)
- [ ] API response time <200ms
- [ ] Database queries optimized
- [ ] Bundle size analyzed

Security:
- [ ] OWASP Top 10 checked
- [ ] Dependencies audited
- [ ] No secrets in code
- [ ] HTTPS configured
- [ ] Rate limiting enabled

Documentation:
- [ ] README complete
- [ ] API docs complete
- [ ] Setup guide works
- [ ] Architecture documented
- [ ] Deployment guide written

Infrastructure:
- [ ] Database backup automated
- [ ] Monitoring configured
- [ ] Error tracking (Sentry) setup
- [ ] Logging configured
- [ ] CI/CD pipeline working

Launch:
- [ ] Announce on social media
- [ ] Send launch email
- [ ] Update landing page
- [ ] Monitor for issues
- [ ] Collect user feedback
```

### Deliverables
- ✅ All tests passing
- ✅ Lighthouse score 90+
- ✅ Production environment deployed
- ✅ Monitoring & alerts configured
- ✅ Documentation complete
- ✅ Team trained on deployment

---

## Success Metrics (MVP)

| Metric | Target | Status |
|--------|--------|--------|
| Page Load (FCP) | < 1.5s | |
| API Response Time | < 200ms | |
| Lighthouse Score | ≥ 90 | |
| Test Coverage | ≥ 80% | |
| Uptime | ≥ 99.5% | |
| Security Issues | 0 critical | |

---

## Phase 2 Preview (Post-MVP)

After MVP launch, planned features:

**Week 1-2: Payments**
- Stripe integration
- Transaction history
- Withdrawal system
- Invoice generation

**Week 3: Enhanced Features**
- Two-factor authentication
- Tutor verification badges
- Advanced analytics
- Promotions system

**Week 4: Video Calling**
- Jitsi Meet integration
- Session recording
- Screen sharing

**Week 5+: Mobile App**
- React Native development
- Feature parity with web
- Push notifications
- Offline support

---

**Last Updated**: May 2026  
**Next Review**: Weekly standups during development

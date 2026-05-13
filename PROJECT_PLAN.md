# Home Tuition Platform - Project Plan

**Version:** 1.0  
**Created:** May 2026  
**Status:** Planning Phase

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Requirements & Scope](#requirements--scope)
3. [Tech Stack](#tech-stack)
4. [MVP Phase 1](#mvp-phase-1)
5. [Non-Functional Requirements](#non-functional-requirements)
6. [Project Structure](#project-structure)
7. [API Specification](#api-specification)
8. [Database Schema](#database-schema)
9. [Milestones & Timeline](#milestones--timeline)
10. [Deployment Strategy](#deployment-strategy)

---

## Executive Summary

**Home Tuition Platform** is a modern, responsive web application connecting students, parents, and tutors for personalized educational services. The platform enables:

- **Students/Parents**: Browse tutor profiles, book sessions, communicate, and track progress
- **Tutors**: Create profiles, manage availability, accept bookings, and build reputation
- **Admins**: Moderate content, manage disputes, and monitor platform health

**MVP Timeline:** 8-10 weeks  
**Target Launch:** Production-ready MVP

---

## Requirements & Scope

### 1. Target Users

| Role | Primary Goals | Key Needs |
|------|---------------|-----------|
| **Students (K-12)** | Find qualified tutors, schedule sessions, communicate | Easy booking, session reminders, progress tracking |
| **Parents** | Find trustworthy tutors, manage student accounts, track progress | Tutor verification, parent dashboard, billing control |
| **Tutors** | Build client base, manage schedule, earn income | Profile visibility, availability management, secure payments |
| **Admin** | Ensure quality, resolve disputes, monitor compliance | Content moderation, analytics, user management |

### 2. Core Features (MVP Phase 1)

#### Authentication & User Management
- ✅ Email/password signup with role selection (Student/Parent/Tutor)
- ✅ Email verification
- ✅ Secure login with JWT tokens
- ✅ Password reset functionality
- ✅ Role-based dashboards

#### Tutor Profile & Discovery
- ✅ Tutor profile creation (name, subjects, rates, bio, qualifications)
- ✅ Profile photo upload (Cloudinary/S3)
- ✅ Subject/grade level selection
- ✅ Hourly rate configuration
- ✅ Availability calendar (weekly schedule)
- ✅ Search & filter (subject, location, price range, rating)
- ✅ Tutor listing page with sorting

#### Student/Parent Dashboard
- ✅ View saved/favorited tutors
- ✅ Booking history
- ✅ Upcoming sessions
- ✅ Profile management

#### Booking & Scheduling System
- ✅ Calendar-based booking interface
- ✅ Session request creation
- ✅ Tutor approval/rejection workflow
- ✅ Booking confirmation & details
- ✅ Session cancellation (with policies)

#### Messaging System
- ✅ Real-time messaging between students and tutors
- ✅ Conversation history
- ✅ Session-linked messages
- ✅ Notification badges

#### Ratings & Reviews
- ✅ 5-star rating system
- ✅ Written reviews (max 500 chars)
- ✅ Verified booking requirement for reviews
- ✅ Average rating display on tutor profiles

#### Responsive UI
- ✅ Mobile-first design
- ✅ Accessible color contrast & typography
- ✅ Touch-friendly interactions
- ✅ Cross-browser compatibility

### 3. Post-MVP Features (Phase 2+)

- Payment processing (Stripe integration)
- Video calling integration (Jitsi/Twilio)
- Session notes & progress tracking
- Admin dashboard with analytics
- Two-factor authentication
- Tutor verification system
- Promotions/discounts
- Advanced analytics & insights
- Mobile app (React Native)

---

## Tech Stack

### Recommended Stack (MERN + TypeScript + Modern Tooling)

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Next.js 15 + React 19 + TypeScript | SSR, SEO, built-in API routes, excellent DX |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid development, accessible components, modern design |
| **Frontend State** | TanStack Query + Zustand | Server state management, lightweight client state |
| **Backend** | Node.js + Express + TypeScript | JavaScript full-stack, rapid development, rich ecosystem |
| **Database** | PostgreSQL 15+ | ACID compliance, relational data, excellent for structured domains |
| **Auth** | JWT + bcrypt | Stateless auth, industry standard |
| **File Upload** | Cloudinary (free tier) | Simple CDN, image optimization, no infra management |
| **Real-time Messaging** | Socket.io (WebSockets) | Real-time chat, event-driven, reduces polling |
| **API Documentation** | Swagger/OpenAPI | Auto-generated docs, client SDK generation |
| **Testing** | Vitest + Testing Library (FE), Jest (BE) | Fast, modern testing frameworks |
| **Deployment** | Vercel (FE) + Railway/Render (BE) | Simple, auto-scaling, free tier available |
| **Environment** | .env files + Zod validation | Type-safe config, secret management |

### Alternative Considerations

- **GraphQL instead of REST**: Skip for MVP (adds complexity without MVP benefit)
- **MongoDB**: Skip (PostgreSQL better for relational tutor-student-booking data)
- **NestJS instead of Express**: Skip for MVP (Express simpler, can migrate if needed)

---

## MVP Phase 1

### Scope (8-10 weeks)

**In Scope:**
- User authentication (3 roles)
- Tutor profiles with availability
- Student booking requests
- Messaging system
- Ratings & reviews
- Search/filtering
- Responsive UI
- Email notifications
- Basic admin panel (user management)

**Out of Scope (Phase 2+):**
- Payments (assume manual for MVP)
- Video calling
- Two-factor authentication
- Advanced analytics
- Mobile app
- Verification badges
- Promotions system

### MVP Success Criteria

- ✅ All core features functional and tested
- ✅ Mobile responsive (320px - 1920px)
- ✅ < 3s page load time (FCP)
- ✅ >= 90 Lighthouse accessibility score
- ✅ Zero security vulnerabilities (OWASP Top 10)
- ✅ 80%+ test coverage (critical paths)
- ✅ Production deployment with CI/CD

---

## Non-Functional Requirements

### Security
- **Password Security**: bcrypt hashing (12+ rounds), minimum 8 characters
- **API Security**: CORS properly configured, HTTPS only, rate limiting
- **Input Validation**: Zod validation on all endpoints, sanitization
- **CSRF Protection**: SameSite cookies, tokens for state-changing operations
- **SQL Injection**: Parameterized queries (via ORM)
- **Authentication**: JWT with 1-hour access tokens + refresh tokens
- **Data Encryption**: SSL/TLS in transit, sensitive data encrypted at rest

### Performance
- **Frontend**:
  - Lighthouse score >= 90
  - First Contentful Paint (FCP) < 1.5s
  - Largest Contentful Paint (LCP) < 2.5s
  - Code splitting for routes (lazy loading)
  - Image optimization (Next.js Image)

- **Backend**:
  - API response time < 200ms (p99)
  - Database queries optimized with indexes
  - Connection pooling configured
  - Caching strategy for profile data (Redis for Phase 2)

### Accessibility (WCAG 2.1 Level AA)
- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support (Tab, Enter, Esc)
- Color contrast ratio >= 4.5:1 for text
- Focus indicators visible
- Alt text for images

### SEO Basics
- Meta tags (title, description, OG tags)
- Structured data (JSON-LD for tutor profiles)
- Sitemap generation
- robots.txt configuration
- Mobile-first indexing support

---

## Project Structure

```
home-tuition/
├── frontend/                     # Next.js app
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── reset-password/
│   │   ├── (dashboard)/
│   │   │   ├── student/
│   │   │   ├── tutor/
│   │   │   └── admin/
│   │   ├── tutors/
│   │   ├── bookings/
│   │   ├── messages/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── auth/
│   │   ├── tutor/
│   │   ├── booking/
│   │   ├── messaging/
│   │   ├── common/
│   │   └── ui/
│   ├── hooks/
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── store/
│   │   └── auth.ts
│   ├── types/
│   │   └── index.ts
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
│
├── backend/                      # Express app
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── tutors.ts
│   │   │   ├── bookings.ts
│   │   │   ├── messages.ts
│   │   │   └── reviews.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── tutorService.ts
│   │   │   ├── bookingService.ts
│   │   │   └── emailService.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Tutor.ts
│   │   │   ├── Booking.ts
│   │   │   └── Message.ts
│   │   ├── db/
│   │   │   ├── connection.ts
│   │   │   └── migrations/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── tests/
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── database/
│   ├── schema.sql
│   └── seeds.sql
│
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── SETUP.md
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## API Specification

### Authentication Endpoints

```
POST /api/auth/signup
  Body: { email, password, role: 'student'|'parent'|'tutor', name }
  Response: { userId, token, refreshToken }

POST /api/auth/login
  Body: { email, password }
  Response: { userId, token, refreshToken, role }

POST /api/auth/refresh
  Body: { refreshToken }
  Response: { token }

POST /api/auth/logout
  Response: { success: true }

POST /api/auth/verify-email
  Body: { token }
  Response: { success: true }

POST /api/auth/forgot-password
  Body: { email }
  Response: { success: true }

POST /api/auth/reset-password
  Body: { token, newPassword }
  Response: { success: true }
```

### Tutor Endpoints

```
GET /api/tutors
  Query: { subject?, minRate?, maxRate?, location?, rating?, page, limit }
  Response: { tutors: Tutor[], total, page, pages }

GET /api/tutors/:id
  Response: { tutor: Tutor, reviews: Review[] }

POST /api/tutors (Protected)
  Body: { subjects, rates, bio, qualifications, availability, profileImage }
  Response: { tutor: Tutor }

PUT /api/tutors/:id (Protected)
  Body: { ...updateFields }
  Response: { tutor: Tutor }

GET /api/tutors/:id/availability
  Response: { availability: Availability[] }

PUT /api/tutors/:id/availability (Protected)
  Body: { weeklySchedule: Object }
  Response: { availability: Availability }
```

### Booking Endpoints

```
POST /api/bookings (Protected)
  Body: { tutorId, sessionDate, startTime, duration, subject }
  Response: { booking: Booking }

GET /api/bookings (Protected)
  Query: { status?, page, limit }
  Response: { bookings: Booking[] }

GET /api/bookings/:id
  Response: { booking: Booking }

PUT /api/bookings/:id/approve (Protected - Tutor only)
  Response: { booking: Booking }

PUT /api/bookings/:id/reject (Protected - Tutor only)
  Body: { reason }
  Response: { booking: Booking }

PUT /api/bookings/:id/cancel (Protected)
  Body: { reason }
  Response: { booking: Booking }

PUT /api/bookings/:id/complete (Protected - Tutor only)
  Response: { booking: Booking }
```

### Messaging Endpoints

```
GET /api/messages/:conversationId (Protected)
  Query: { page, limit }
  Response: { messages: Message[], total }

POST /api/messages (Protected)
  Body: { conversationId, text, bookingId? }
  Response: { message: Message }

GET /api/conversations (Protected)
  Response: { conversations: Conversation[] }

POST /api/conversations (Protected)
  Body: { participantId }
  Response: { conversation: Conversation }
```

### Review Endpoints

```
POST /api/reviews (Protected)
  Body: { tutorId, bookingId, rating, comment }
  Response: { review: Review }

GET /api/reviews/tutor/:tutorId
  Query: { page, limit }
  Response: { reviews: Review[], average: number }

DELETE /api/reviews/:id (Protected)
  Response: { success: true }
```

### User Endpoints

```
GET /api/users/me (Protected)
  Response: { user: User }

PUT /api/users/me (Protected)
  Body: { ...updateFields }
  Response: { user: User }

GET /api/users/:id
  Response: { user: User }
```

---

## Database Schema

### PostgreSQL Tables

**users**
```sql
id UUID PRIMARY KEY
email VARCHAR(255) UNIQUE NOT NULL
password_hash VARCHAR(255) NOT NULL
role ENUM('student', 'parent', 'tutor', 'admin')
name VARCHAR(255) NOT NULL
avatar_url VARCHAR(500)
bio TEXT
verified BOOLEAN DEFAULT FALSE
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

**tutors**
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES users(id)
subjects JSONB (array of subjects)
hourly_rate DECIMAL(10,2)
qualifications TEXT
bio TEXT
profile_image_url VARCHAR(500)
average_rating DECIMAL(3,2) DEFAULT 0
total_reviews INTEGER DEFAULT 0
location VARCHAR(255)
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

**availability**
```sql
id UUID PRIMARY KEY
tutor_id UUID REFERENCES tutors(id)
day_of_week INTEGER (0-6)
start_time TIME
end_time TIME
is_available BOOLEAN DEFAULT TRUE
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

**bookings**
```sql
id UUID PRIMARY KEY
student_id UUID REFERENCES users(id)
tutor_id UUID REFERENCES tutors(id)
session_date DATE
start_time TIME
duration_minutes INTEGER
subject VARCHAR(255)
status ENUM('pending', 'confirmed', 'completed', 'cancelled')
cancellation_reason TEXT
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

**messages**
```sql
id UUID PRIMARY KEY
conversation_id UUID REFERENCES conversations(id)
sender_id UUID REFERENCES users(id)
text TEXT NOT NULL
booking_id UUID REFERENCES bookings(id) (nullable)
is_read BOOLEAN DEFAULT FALSE
created_at TIMESTAMP DEFAULT NOW()
```

**conversations**
```sql
id UUID PRIMARY KEY
participant_1_id UUID REFERENCES users(id)
participant_2_id UUID REFERENCES users(id)
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

**reviews**
```sql
id UUID PRIMARY KEY
booking_id UUID REFERENCES bookings(id)
reviewer_id UUID REFERENCES users(id)
tutor_id UUID REFERENCES tutors(id)
rating INTEGER (1-5)
comment TEXT
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

---

## Milestones & Timeline

### Week 1-2: Project Setup & Infrastructure
- ✅ Repository setup (GitHub)
- ✅ Frontend scaffold (Next.js)
- ✅ Backend scaffold (Express)
- ✅ Database setup (PostgreSQL local + cloud)
- ✅ Docker compose for local development
- ✅ CI/CD pipeline (GitHub Actions)
- ✅ Environment configuration

### Week 3-4: Authentication & User Management
- ✅ User registration (3 roles)
- ✅ Email verification
- ✅ Login/logout with JWT
- ✅ Password reset flow
- ✅ Frontend auth pages (signup, login, reset)
- ✅ Protected routes middleware

### Week 5-6: Tutor Features
- ✅ Tutor profile creation/editing
- ✅ Profile image upload
- ✅ Availability calendar setup
- ✅ Tutor listing page
- ✅ Search/filter functionality
- ✅ Tutor detail page

### Week 7: Booking System
- ✅ Booking request creation
- ✅ Tutor approval/rejection
- ✅ Calendar-based booking UI
- ✅ Booking history view
- ✅ Cancellation logic

### Week 8: Messaging & Reviews
- ✅ Real-time messaging with Socket.io
- ✅ Conversation list
- ✅ Message UI component
- ✅ Review submission
- ✅ Review display on profiles

### Week 9: Admin & Dashboards
- ✅ Role-based dashboards
- ✅ Basic admin panel
- ✅ Analytics views
- ✅ User management

### Week 10: Testing, Optimization & Launch
- ✅ End-to-end testing
- ✅ Performance optimization
- ✅ Security audit
- ✅ Production deployment
- ✅ Documentation

---

## Deployment Strategy

### Frontend (Vercel)
```
- Push to main branch triggers automatic deploy
- Preview deploys for PRs
- Environment variables managed in Vercel dashboard
- CDN distributed globally
```

### Backend (Railway/Render)
```
- Docker containerized for easy deployment
- PostgreSQL cloud instance (Railway/Heroku PostgreSQL)
- Environment variables via .env
- Auto-restart on crashes
- Scaling via platform dashboard
```

### Database (PostgreSQL Cloud)
```
Options:
- Railway PostgreSQL (simple, included)
- Supabase (PostgreSQL + auth tools)
- AWS RDS (production-grade)
- DigitalOcean Managed Database

Backup strategy:
- Daily automated backups
- 30-day retention
```

### Monitoring & Logging
```
- Backend logging: winston/pino
- Error tracking: Sentry (free tier)
- Uptime monitoring: Uptime Robot
- Performance: Vercel Analytics
```

---

## Success Metrics (MVP)

| Metric | Target |
|--------|--------|
| Page Load Time (FCP) | < 1.5s |
| API Response Time | < 200ms (p99) |
| Lighthouse Score | >= 90 |
| Accessibility Score | >= 90 |
| Test Coverage | >= 80% |
| Uptime | >= 99.5% |
| Security Issues | 0 critical |

---

## Next Steps

1. **Confirm tech stack** (proceed with recommendations or specify alternatives)
2. **Review API specification** and provide feedback
3. **Begin Week 1 tasks** (project setup)
4. **Assign team members** to parallel workstreams
5. **Set up development environment** (local setup guide)

---

**Document Version History**
| Version | Date | Changes |
|---------|------|---------|
| 1.0 | May 2026 | Initial plan |


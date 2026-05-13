# Home Tuition Platform

A modern, responsive web platform connecting students, parents, and tutors for personalized educational services.

![Status](https://img.shields.io/badge/Status-MVP%20Development-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🎯 Overview

**Home Tuition Platform** is a full-stack web application that makes finding, booking, and managing tutoring sessions easy and affordable. Whether you're a student looking for academic help, a parent seeking qualified tutors, or an educator wanting to expand your reach, HomeTuition is your solution.

### Key Features

- 🔍 **Smart Tutor Discovery** - Search and filter by subject, rate, location, and rating
- 📅 **Easy Booking System** - Calendar-based scheduling with instant confirmation
- 💬 **Real-time Messaging** - Communicate directly with tutors
- ⭐ **Ratings & Reviews** - Build trust through transparent reviews
- 👥 **Role-based Access** - Separate dashboards for students, parents, and tutors
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- 🔒 **Secure** - Enterprise-grade security with JWT authentication

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17+ ([Download](https://nodejs.org/))
- PostgreSQL 15+ ([Download](https://www.postgresql.org/))
- Git ([Download](https://git-scm.com/))

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/home-tuition.git
cd home-tuition
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env.local
npm run dev
```

The backend will start at `http://localhost:5000`

### 3. Setup Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

The frontend will start at `http://localhost:3000`

### 4. Setup Database

```bash
# Create database
createdb home_tuition

# Run migrations
cd backend
npm run migrate
```

**For detailed setup instructions**, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

## 📁 Project Structure

```
home-tuition/
├── backend/                        # Node.js + Express API
│   ├── src/
│   │   ├── app.ts                 # Express configuration
│   │   ├── server.ts              # Server entry point
│   │   ├── db/                    # Database setup
│   │   ├── routes/                # API routes
│   │   ├── middleware/            # Auth, validation, errors
│   │   ├── services/              # Business logic
│   │   ├── models/                # Database models
│   │   └── utils/                 # Utilities
│   ├── tests/                     # Unit/integration tests
│   ├── package.json
│   └── .env.example
│
├── frontend/                       # Next.js + React app
│   ├── app/                       # App router
│   ├── components/                # React components
│   ├── lib/                       # Utilities & API client
│   ├── store/                     # Zustand state management
│   ├── types/                     # TypeScript types
│   ├── public/                    # Static assets
│   ├── package.json
│   └── .env.local.example
│
├── docs/                          # Documentation
│   ├── PROJECT_PLAN.md
│   ├── SETUP_GUIDE.md
│   ├── API_DOCUMENTATION.md
│   └── ARCHITECTURE.md
│
├── .gitignore
└── README.md (this file)
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand + TanStack Query
- **Real-time**: Socket.io client
- **Forms**: React Hook Form + Zod validation

### Backend
- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.io
- **File Upload**: Cloudinary
- **Email**: Nodemailer
- **Validation**: Express Validator + Zod

### DevOps
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway / Render
- **Database**: PostgreSQL Cloud (Supabase/Railway)
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry + Uptime Robot

---

## 📚 Documentation

- **[PROJECT_PLAN.md](./PROJECT_PLAN.md)** - Full project requirements, scope, and timeline
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed local development setup
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference with examples
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - System design and architecture decisions

---

## 🚦 MVP Roadmap

### Phase 1: MVP (8-10 weeks) ✅ In Progress

**Week 1-2**: Project setup & infrastructure
- ✅ Repository & structure
- ✅ Database schema
- ✅ CI/CD pipeline
- ⏳ Docker setup

**Week 3-4**: Authentication & user management
- ⏳ User registration
- ⏳ Email verification
- ⏳ Login/logout
- ⏳ Password reset

**Week 5-6**: Tutor features
- ⏳ Profile creation
- ⏳ Availability management
- ⏳ Search & filtering
- ⏳ Ratings display

**Week 7**: Booking system
- ⏳ Request creation
- ⏳ Calendar interface
- ⏳ Status management
- ⏳ Cancellation

**Week 8**: Messaging & reviews
- ⏳ Real-time chat
- ⏳ Review system
- ⏳ Notifications

**Week 9**: Admin & dashboards
- ⏳ Role-based dashboards
- ⏳ Admin panel
- ⏳ Analytics

**Week 10**: Testing & launch
- ⏳ E2E testing
- ⏳ Performance optimization
- ⏳ Security audit
- ⏳ Production deployment

### Phase 2: Enhancements (Post-MVP)

- 🔲 Payment processing (Stripe)
- 🔲 Video calling (Jitsi/Twilio)
- 🔲 Two-factor authentication
- 🔲 Tutor verification system
- 🔲 Advanced analytics
- 🔲 Mobile app (React Native)
- 🔲 Promotions & discounts

---

## 🔐 Security

We take security seriously. The platform implements:

- ✅ JWT-based authentication with refresh tokens
- ✅ bcrypt password hashing (12+ rounds)
- ✅ CORS properly configured
- ✅ Input validation & sanitization (Zod)
- ✅ Rate limiting on API endpoints
- ✅ SQL injection prevention (parameterized queries)
- ✅ CSRF protection
- ✅ HTTPS-only in production
- ✅ Environment variable encryption

**For security considerations**, see [SECURITY.md](./docs/SECURITY.md)

---

## ♿ Accessibility

We're committed to WCAG 2.1 Level AA compliance:

- ✅ Semantic HTML structure
- ✅ ARIA labels & roles
- ✅ Keyboard navigation support
- ✅ High contrast colors (4.5:1+)
- ✅ Screen reader compatible
- ✅ Focus indicators visible

---

## ⚡ Performance

**Frontend Targets:**
- Lighthouse score: 90+
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Code-split routes for lazy loading

**Backend Targets:**
- API response time: < 200ms (p99)
- Database query optimization with indexes
- Connection pooling configured

---

## 📊 Monitoring & Analytics

- **Error Tracking**: Sentry integration (Phase 2)
- **Performance**: Vercel Analytics
- **Uptime**: Uptime Robot monitoring
- **Logging**: Structured logging with winston/pino
- **Metrics**: Custom analytics dashboard

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Format with Prettier
- Write tests for new features
- Update documentation

---

## 🐛 Troubleshooting

### Common Issues

**Port already in use?**
```bash
# macOS/Linux
lsof -i :5000 && kill -9 <PID>

# Windows
netstat -ano | findstr :5000 && taskkill /PID <PID> /F
```

**Database connection error?**
```bash
# Verify PostgreSQL is running
psql -U postgres -c "SELECT 1;"
```

**JWT token errors?**
```bash
# Ensure JWT_SECRET is set in .env
# Min 32 characters recommended
openssl rand -base64 32
```

For more troubleshooting, see [SETUP_GUIDE.md#troubleshooting](./SETUP_GUIDE.md#troubleshooting)

---

## 📞 Support & Community

- **Issues**: [GitHub Issues](https://github.com/yourusername/home-tuition/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/home-tuition/discussions)
- **Email**: support@hometuition.com

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database by [PostgreSQL](https://www.postgresql.org/)
- Icons from [Lucide React](https://lucide.dev/)
- UI Components from [shadcn/ui](https://ui.shadcn.com/)

---

## 📋 Checklist for Developers

When starting development:

- [ ] Clone repository
- [ ] Complete setup from [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- [ ] Create `.env.local` files in backend and frontend
- [ ] Run database migrations
- [ ] Start backend (`npm run dev` in `/backend`)
- [ ] Start frontend (`npm run dev` in `/frontend`)
- [ ] Test health endpoints
- [ ] Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- [ ] Review [PROJECT_PLAN.md](./PROJECT_PLAN.md)

---

**Version**: 1.0.0  
**Last Updated**: May 2026  
**Status**: MVP Development 🚀

---

Have questions? Open an issue or check our [documentation](./docs/).

# Home Tuition Platform - Setup Guide

**Version:** 1.0  
**Last Updated:** May 2026

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Database Setup](#database-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Running the Application](#running-the-application)
7. [Environment Configuration](#environment-configuration)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you start, ensure you have the following installed:

- **Node.js** (v18.17+ recommended): [Download](https://nodejs.org/)
- **npm** or **yarn** (v9+ for npm)
- **PostgreSQL** (v15+): [Download](https://www.postgresql.org/download/)
- **Git**: [Download](https://git-scm.com/)
- **VS Code** (optional but recommended): [Download](https://code.visualstudio.com/)

### Verify Installation

```bash
node --version      # Should be v18.17 or higher
npm --version       # Should be v9 or higher
psql --version      # Should be v15 or higher
git --version       # Any recent version
```

---

## Local Development Setup

### 1. Clone the Repository

```bash
cd ~/Documents
git clone https://github.com/yourusername/home-tuition.git
cd home-tuition
```

### 2. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

### 3. Create Environment Files

#### Backend
```bash
cd backend
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/home_tuition
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=home_tuition
PORT=5000
NODE_ENV=development
JWT_SECRET=dev_secret_key_change_in_production_min_32_chars
JWT_REFRESH_SECRET=dev_refresh_secret_key_change_in_production_32_chars
FRONTEND_URL=http://localhost:3000
```

#### Frontend
```bash
cd ../frontend
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_ENVIRONMENT=development
```

---

## Database Setup

### 1. Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# In psql console:
CREATE DATABASE home_tuition;
CREATE USER tuition_user WITH PASSWORD 'secure_password_here';
ALTER ROLE tuition_user SET client_encoding TO 'utf8';
ALTER ROLE tuition_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE tuition_user SET default_transaction_deferrable TO on;
ALTER ROLE tuition_user SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE home_tuition TO tuition_user;

# Exit psql
\q
```

### 2. Initialize Database Schema

```bash
cd backend

# Run migrations (creates tables)
npm run build
npm run migrate
```

This will:
- Create all necessary tables
- Set up indexes for performance
- Configure constraints

### 3. Verify Database Connection

```bash
psql -U postgres -h localhost -d home_tuition -c "SELECT version();"
```

---

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build TypeScript

```bash
npm run build
```

### 4. Verify Server Starts

```bash
npm run dev
```

You should see:
```
╔════════════════════════════════════════════╗
║    Home Tuition Backend Server Started    ║
║    Port: 5000                              ║
║    Environment: development                ║
╚════════════════════════════════════════════╝
```

Test the health endpoint:
```bash
curl http://localhost:5000/api/health
# Expected response: {"status":"ok","timestamp":"2026-05-12T..."}
```

---

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Verify Build

```bash
npm run build
```

### 4. Start Development Server

```bash
npm run dev
```

The frontend will start at: `http://localhost:3000`

---

## Running the Application

### Option 1: Terminal Tabs (Recommended for Development)

**Tab 1 - Backend Server:**
```bash
cd backend
npm run dev
```

**Tab 2 - Frontend Server:**
```bash
cd frontend
npm run dev
```

**Tab 3 - Database (if running locally):**
```bash
# PostgreSQL should be running as a service
# Verify with: psql -U postgres -c "SELECT 1;"
```

### Option 2: Docker Compose (Coming in Phase 2)

```bash
docker-compose up -d
```

---

## Environment Configuration

### Backend Configuration

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | Full DB connection string | `postgresql://user:pass@localhost:5432/db` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development`, `production` |
| `JWT_SECRET` | Access token signing key | Min 32 chars |
| `JWT_EXPIRE` | Access token expiry | `1h` |
| `FRONTEND_URL` | CORS allowed origin | `http://localhost:3000` |
| `SMTP_HOST` | Email server host | `smtp.gmail.com` |
| `CLOUDINARY_*` | Image upload service | API credentials |

### Frontend Configuration

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | `http://localhost:5000/api` |
| `NEXT_PUBLIC_ENVIRONMENT` | Environment | `development`, `production` |

---

## Verification Checklist

After setup, verify everything works:

### Backend Checks
- ✅ `npm run dev` starts without errors
- ✅ GET `http://localhost:5000/api/health` returns 200
- ✅ Database connection works: `psql -U postgres -d home_tuition -c "\dt"`
- ✅ No TypeScript errors: `npm run build` completes

### Frontend Checks
- ✅ `npm run dev` starts successfully
- ✅ `http://localhost:3000` loads in browser
- ✅ Home page displays correctly
- ✅ No build errors: `npm run build` completes

### Database Checks
- ✅ All tables exist: `\dt` in psql
- ✅ Can query tables: `SELECT * FROM users;`
- ✅ Indexes created: `\di` in psql

---

## Common Issues & Solutions

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=5001 npm run dev
```

### Issue: "Database connection refused"

**Solution:**
```bash
# Verify PostgreSQL is running
pg_isready -h localhost -p 5432

# If not running, start PostgreSQL
# On macOS:
brew services start postgresql

# On Windows:
# Open Services and start PostgreSQL

# On Linux:
sudo systemctl start postgresql
```

### Issue: "EADDRINUSE: address already in use :::3000"

**Solution:**
```bash
# Kill Next.js process
lsof -i :3000
kill -9 <PID>

# Or restart from different port
PORT=3001 npm run dev
```

### Issue: "createdb: error: could not connect to database server"

**Solution:**
```bash
# Make sure PostgreSQL server is running
sudo service postgresql start

# Or verify with psql
psql -U postgres -c "SELECT 1;"
```

### Issue: JWT token validation errors

**Solution:**
```bash
# Ensure JWT_SECRET is set and same in .env
# Min 32 characters recommended
# Generate random string:
openssl rand -base64 32
```

---

## Project Structure Overview

```
home-tuition/
├── backend/                    # Express API
│   ├── src/
│   │   ├── app.ts             # Express config
│   │   ├── server.ts          # Entry point
│   │   ├── db/                # Database
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Auth, validation
│   │   └── utils/             # Helpers
│   ├── .env.example
│   └── package.json
│
├── frontend/                   # Next.js app
│   ├── app/                   # App router
│   ├── components/            # React components
│   ├── lib/                   # Utilities
│   ├── store/                 # Zustand stores
│   ├── .env.local.example
│   └── package.json
│
├── docs/                      # Documentation
└── README.md
```

---

## Next Steps

1. ✅ Complete setup using this guide
2. ⬜ Test API endpoints (see API.md)
3. ⬜ Create user account via signup
4. ⬜ Review component examples
5. ⬜ Start implementing Phase 1 features

---

## Getting Help

- **Backend Issues**: Check `backend/` logs
- **Database Issues**: Check PostgreSQL logs
- **Frontend Issues**: Check browser console (F12)
- **Documentation**: See `docs/` folder

---

## Performance Tips

### Backend
- Use database indexes (already configured)
- Enable query logging for slow queries
- Implement caching (Redis - Phase 2)

### Frontend
- Use browser DevTools to profile
- Check Lighthouse scores: `npm audit`
- Monitor bundle size: `npm run build`

---

**Last Updated:** May 2026  
**Maintainer:** Development Team

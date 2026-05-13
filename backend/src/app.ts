import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import {
  requestIdMiddleware,
  notFoundHandler,
  errorHandler,
} from './middleware/errorHandler';
import logsRouter from './routes/logs';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Express = express();

// ============ MIDDLEWARE ============

// Add request ID to all requests
app.use(requestIdMiddleware);

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  })
);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const requestId = (req as any).requestId;
  console.log(
    `${timestamp} [${requestId}] ${req.method} ${req.path}`
  );
  next();
});

// ============ ROUTES ============

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Logging routes
app.use('/api/logs', logsRouter);

// TODO: Import and register application routes
// app.use('/api/auth', authRoutes);
// app.use('/api/tutors', tutorRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use('/api/users', userRoutes);

// ============ ERROR HANDLERS (ORDER MATTERS) ============

// 404 handler - Must come after all other routes
app.use(notFoundHandler);

// Global error handler - Must be last
app.use(errorHandler);

export default app;

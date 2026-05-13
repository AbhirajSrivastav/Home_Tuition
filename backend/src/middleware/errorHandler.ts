import { Express, Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Extended Error interface with additional properties
 */
export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  path?: string;
  requestId?: string;
}

/**
 * Request ID middleware - Add unique identifier to each request
 */
export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requestId = req.headers['x-request-id'] || uuidv4();
  (req as any).requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
}

/**
 * 404 Not Found middleware
 * This middleware catches all unmatched routes
 * Must be placed AFTER all other route handlers
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  const error: ApiError = new Error(
    `Endpoint not found: ${req.method} ${req.originalUrl}`
  );
  error.statusCode = 404;
  error.code = 'NOT_FOUND';
  error.path = req.originalUrl;
  error.requestId = (req as any).requestId;

  // Log 404 event
  const logData = {
    timestamp: new Date().toISOString(),
    status: 404,
    method: req.method,
    path: req.originalUrl,
    query: req.query,
    referrer: req.get('referrer'),
    userAgent: req.get('user-agent'),
    ip: req.ip,
    requestId: (req as any).requestId,
  };

  console.warn('[404_NOT_FOUND]', JSON.stringify(logData, null, 2));

  // Send JSON response
  res.status(404).json({
    success: false,
    error: {
      message: 'Not Found',
      code: 'NOT_FOUND',
      statusCode: 404,
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId,
    },
  });
}

/**
 * Global error handler middleware
 * This middleware catches all errors thrown by route handlers
 * Must be placed LAST in the middleware chain
 */
export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const requestId = (req as any).requestId || 'unknown';
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Log error
  const errorLog = {
    timestamp: new Date().toISOString(),
    status: statusCode,
    code: err.code || 'INTERNAL_ERROR',
    message: err.message,
    method: req.method,
    path: req.originalUrl,
    requestId,
    ...(isDevelopment && { stack: err.stack }),
    userAgent: req.get('user-agent'),
    ip: req.ip,
  };

  if (statusCode === 500) {
    console.error('[ERROR]', JSON.stringify(errorLog, null, 2));
  } else {
    console.warn('[ERROR]', JSON.stringify(errorLog, null, 2));
  }

  // Send error response
  const errorResponse: any = {
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      code: err.code || 'INTERNAL_ERROR',
      statusCode,
      requestId,
      timestamp: new Date().toISOString(),
    },
  };

  // Add stack trace in development
  if (isDevelopment && err.stack) {
    errorResponse.error.stack = err.stack.split('\n');
  }

  res.status(statusCode).json(errorResponse);
}

/**
 * Utility function to create API errors
 */
export function createApiError(
  message: string,
  statusCode: number = 500,
  code?: string
): ApiError {
  const error: ApiError = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
}

/**
 * Async error wrapper for Express route handlers
 * Converts unhandled promise rejections to error middleware
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Validation error handler
 */
export function handleValidationError(
  errors: Record<string, string[]>
): ApiError {
  const message = Object.entries(errors)
    .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
    .join('; ');

  const error = createApiError(message, 400, 'VALIDATION_ERROR');
  return error;
}

/**
 * Authentication error handler
 */
export function handleAuthError(message?: string): ApiError {
  return createApiError(
    message || 'Unauthorized',
    401,
    'UNAUTHORIZED'
  );
}

/**
 * Authorization error handler
 */
export function handleAuthorizationError(message?: string): ApiError {
  return createApiError(
    message || 'Forbidden',
    403,
    'FORBIDDEN'
  );
}

import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

/**
 * 404 Event Logging
 * POST /api/logs/404
 * 
 * Logs when a user lands on a 404 page
 * Used for analytics and monitoring
 */
router.post('/404', (req: Request, res: Response) => {
  const { path, referrer, timestamp, userAgent } = req.body;

  // Validate payload
  if (!path || !timestamp) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: path, timestamp',
    });
  }

  const logEntry = {
    type: '404_PAGE_VIEW',
    timestamp,
    path,
    referrer: referrer || null,
    userAgent: userAgent || null,
    ip: req.ip,
    recordedAt: new Date().toISOString(),
  };

  // Log to console (in production, send to logging service like Sentry, LogRocket, etc.)
  console.info('[404_PAGE_VIEW]', JSON.stringify(logEntry, null, 2));

  // TODO: Implement persistent storage
  // - Save to database
  // - Send to external analytics service
  // - Update aggregated metrics
  
  // Example: Send to Sentry
  // if (process.env.SENTRY_DSN) {
  //   Sentry.captureMessage('404 Page View', {
  //     level: 'info',
  //     extra: logEntry,
  //   });
  // }

  res.status(201).json({
    success: true,
    message: '404 event logged successfully',
    logId: generateLogId(),
  });
});

/**
 * 404 Search Event Logging
 * POST /api/logs/404/search
 * 
 * Logs when a user searches from a 404 page
 */
router.post('/404/search', (req: Request, res: Response) => {
  const { query, resultsCount, selectedResultIndex } = req.body;

  if (!query) {
    return res.status(400).json({
      success: false,
      error: 'Missing required field: query',
    });
  }

  const logEntry = {
    type: '404_SEARCH',
    query,
    resultsCount: resultsCount || 0,
    selectedResultIndex: selectedResultIndex || null,
    timestamp: new Date().toISOString(),
    ip: req.ip,
  };

  console.info('[404_SEARCH]', JSON.stringify(logEntry, null, 2));

  res.status(201).json({
    success: true,
    message: 'Search event logged',
    logId: generateLogId(),
  });
});

/**
 * 404 Navigation Event Logging
 * POST /api/logs/404/navigation
 * 
 * Logs when a user navigates from the 404 page
 */
router.post('/404/navigation', (req: Request, res: Response) => {
  const { destination, linkType } = req.body;

  if (!destination) {
    return res.status(400).json({
      success: false,
      error: 'Missing required field: destination',
    });
  }

  const logEntry = {
    type: '404_NAVIGATION',
    destination,
    linkType: linkType || 'unknown', // 'quick_link', 'button', 'search', etc.
    timestamp: new Date().toISOString(),
    ip: req.ip,
  };

  console.info('[404_NAVIGATION]', JSON.stringify(logEntry, null, 2));

  res.status(201).json({
    success: true,
    message: 'Navigation event logged',
    logId: generateLogId(),
  });
});

/**
 * Client Error Logging
 * POST /api/logs/error
 * 
 * Logs errors that occur on the client side
 */
router.post('/error', (req: Request, res: Response) => {
  const { message, stack, digest, timestamp, additionalInfo } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      error: 'Missing required field: message',
    });
  }

  const logEntry = {
    type: 'CLIENT_ERROR',
    message,
    digest,
    timestamp,
    stack: stack ? stack.slice(0, 5) : null, // Limit stack trace
    additionalInfo: additionalInfo || {},
    ip: req.ip,
    userAgent: req.get('user-agent'),
    recordedAt: new Date().toISOString(),
  };

  console.error('[CLIENT_ERROR]', JSON.stringify(logEntry, null, 2));

  // TODO: Implement error tracking
  // - Send to Sentry
  // - Send to LogRocket
  // - Save to database
  // - Alert on critical errors

  res.status(201).json({
    success: true,
    message: 'Error logged successfully',
    errorId: generateLogId(),
  });
});

/**
 * Get 404 Statistics
 * GET /api/logs/404/stats
 * 
 * Returns aggregated 404 statistics (admin only)
 */
router.get('/404/stats', (req: Request, res: Response) => {
  // TODO: Implement stats retrieval
  // This would query aggregated 404 data from database
  
  const stats = {
    total404s: 0,
    unique404Paths: [],
    topReferrers: [],
    topSearchQueries: [],
    trendsOverTime: [],
    period: 'last_7_days',
  };

  res.json({
    success: true,
    data: stats,
  });
});

/**
 * Get 404 Events
 * GET /api/logs/404/events
 * 
 * Returns paginated 404 events (admin only)
 */
router.get('/404/events', (req: Request, res: Response) => {
  const { page = 1, limit = 50, path } = req.query;

  // TODO: Implement event retrieval with filtering
  
  const events = {
    total: 0,
    page: Number(page),
    limit: Number(limit),
    items: [],
  };

  res.json({
    success: true,
    data: events,
  });
});

/**
 * Health check for logs endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'Logging service is operational',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Helper function to generate unique log IDs
 */
function generateLogId(): string {
  return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default router;

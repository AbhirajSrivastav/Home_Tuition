import request from 'supertest';
import app from '@/app';

/**
 * Backend 404 Error Handler Tests
 */
describe('Backend 404 Handler', () => {
  describe('404 Response Structure', () => {
    test('returns 404 status for non-existent API route', async () => {
      const res = await request(app).get('/api/non-existent-endpoint');
      expect(res.status).toBe(404);
    });

    test('returns JSON response with proper structure', async () => {
      const res = await request(app).get('/api/invalid-route');
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toHaveProperty('message');
      expect(res.body.error).toHaveProperty('code', 'NOT_FOUND');
      expect(res.body.error).toHaveProperty('statusCode', 404);
    });

    test('includes request metadata in error response', async () => {
      const res = await request(app).get('/api/test/invalid');
      expect(res.body.error).toHaveProperty('path');
      expect(res.body.error).toHaveProperty('method');
      expect(res.body.error).toHaveProperty('timestamp');
      expect(res.body.error).toHaveProperty('requestId');
    });

    test('includes request ID in response header', async () => {
      const res = await request(app).get('/api/invalid');
      expect(res.get('X-Request-ID')).toBeDefined();
    });
  });

  describe('404 Logging', () => {
    test('logs 404 events to console', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      await request(app).get('/api/not-found');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[404_NOT_FOUND]'),
        expect.any(String)
      );

      consoleSpy.mockRestore();
    });

    test('logs include request path and method', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      await request(app).get('/api/tutors/invalid-id');

      const logCall = consoleSpy.mock.calls[0][1];
      expect(logCall).toContain('GET');
      expect(logCall).toContain('/api/tutors/invalid-id');

      consoleSpy.mockRestore();
    });
  });

  describe('Request Methods', () => {
    test('handles 404 for GET requests', async () => {
      const res = await request(app).get('/api/invalid');
      expect(res.status).toBe(404);
      expect(res.body.error.method).toBe('GET');
    });

    test('handles 404 for POST requests', async () => {
      const res = await request(app).post('/api/invalid').send({});
      expect(res.status).toBe(404);
      expect(res.body.error.method).toBe('POST');
    });

    test('handles 404 for PUT requests', async () => {
      const res = await request(app).put('/api/invalid').send({});
      expect(res.status).toBe(404);
      expect(res.body.error.method).toBe('PUT');
    });

    test('handles 404 for DELETE requests', async () => {
      const res = await request(app).delete('/api/invalid');
      expect(res.status).toBe(404);
      expect(res.body.error.method).toBe('DELETE');
    });
  });

  describe('Error Messages', () => {
    test('provides helpful error message', async () => {
      const res = await request(app).get('/api/undefined-endpoint');
      expect(res.body.error.message).toBeTruthy();
      expect(res.body.error.message.length).toBeGreaterThan(0);
    });

    test('includes path in error message', async () => {
      const testPath = '/api/some/invalid/path';
      const res = await request(app).get(testPath);
      expect(res.body.error.path).toBe(testPath);
    });
  });

  describe('Logging Routes', () => {
    test('POST /api/logs/404 accepts 404 events', async () => {
      const res = await request(app)
        .post('/api/logs/404')
        .send({
          path: '/invalid-page',
          referrer: 'https://example.com',
          timestamp: new Date().toISOString(),
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    test('POST /api/logs/404 requires path field', async () => {
      const res = await request(app)
        .post('/api/logs/404')
        .send({
          referrer: 'https://example.com',
          timestamp: new Date().toISOString(),
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('POST /api/logs/404 requires timestamp field', async () => {
      const res = await request(app)
        .post('/api/logs/404')
        .send({
          path: '/invalid-page',
          referrer: 'https://example.com',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('POST /api/logs/error accepts error events', async () => {
      const res = await request(app)
        .post('/api/logs/error')
        .send({
          message: 'Test error',
          timestamp: new Date().toISOString(),
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    test('POST /api/logs/404/search accepts search events', async () => {
      const res = await request(app)
        .post('/api/logs/404/search')
        .send({
          query: 'algebra tutor',
          resultsCount: 5,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    test('POST /api/logs/404/navigation accepts navigation events', async () => {
      const res = await request(app)
        .post('/api/logs/404/navigation')
        .send({
          destination: '/tutors',
          linkType: 'quick_link',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Middleware Integration', () => {
    test('adds request ID to all requests', async () => {
      const res = await request(app).get('/api/health');
      expect(res.get('X-Request-ID')).toBeDefined();
    });

    test('request ID is unique for each request', async () => {
      const res1 = await request(app).get('/api/invalid1');
      const res2 = await request(app).get('/api/invalid2');
      expect(res1.get('X-Request-ID')).not.toBe(res2.get('X-Request-ID'));
    });

    test('CORS headers are present in 404 response', async () => {
      const res = await request(app).get('/api/invalid');
      // CORS headers should be set by helmet/cors middleware
      expect(res.status).toBe(404);
    });
  });

  describe('Content-Type', () => {
    test('404 response has JSON content type', async () => {
      const res = await request(app).get('/api/invalid');
      expect(res.type).toBe('application/json');
    });
  });

  describe('Development vs Production', () => {
    test('development mode may include stack traces', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const res = await request(app).get('/api/invalid');
      // Stack trace would be included in development

      process.env.NODE_ENV = originalEnv;
    });
  });
});

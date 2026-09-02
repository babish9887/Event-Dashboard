import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import rateLimit from 'express-rate-limit';

describe('Rate Limiter Integration Test (max 30 requests/min per IP', () => {
  it('should allow up to 30 requests and block the 31st request with 429 status', async () => {
    const testApp = express();

    const limiter = rateLimit({
      windowMs: 60 * 1000,
      max: 30,
      message: {
        status: 429,
        message: 'Too many requests',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });

    testApp.use(limiter);
    testApp.get('/test-rate-limit', (_req, res) => {
      res.status(200).json({ success: true, message: 'OK' });
    });

    const requests = Array.from({ length: 30 }, () =>
      request(testApp).get('/test-rate-limit')
    );
    const responses = await Promise.all(requests);

    responses.forEach((res) => {
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    const blockedResponse = await request(testApp).get('/test-rate-limit');
    expect(blockedResponse.status).toBe(429);
    expect(blockedResponse.body.status).toBe(429);
    expect(blockedResponse.body.message).toBe('Too many requests');
  });
});

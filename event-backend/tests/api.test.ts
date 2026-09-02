import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { EventModel } from '../models/event.model';

describe('Event API Endpoints & Rate Limiting', () => {
  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event_db';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('GET /api/events should return paginated list of events', async () => {
    const res = await request(app).get('/api/events?page=1&limit=5');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.limit).toBe(5);
  });

  it('GET /api/events with event_type filter should filter by category', async () => {
    const res = await request(app).get('/api/events?event_type=Conference');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    res.body.data.forEach((evt: any) => {
      expect(evt.category).toBe('Conference');
    });
  });

  it('GET /api/events with date_range filter should filter by date range', async () => {
    const res = await request(app).get('/api/events?date_range=24h');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/events should create a new event', async () => {
    const newEvent = {
      title: 'Test Hackathon 2026',
      description: 'A test hackathon for automated vitest suite.',
      date: new Date('2026-12-01T10:00:00Z').toISOString(),
      location: 'Kathmandu, Nepal',
      category: 'Technology',
      capacity: 100,
      organizer: 'Test Organizer',
    };

    const res = await request(app).post('/api/events').send(newEvent);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(newEvent.title);

    if (res.body.data?._id) {
      await EventModel.findByIdAndDelete(res.body.data._id);
    }
  });

  it('GET /api/events/analytics should return aggregate metrics', async () => {
    const res = await request(app).get('/api/events/analytics');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalEvents).toBeDefined();
    expect(res.body.data.categoryBreakdown).toBeDefined();
    expect(res.body.data.eventCountsLast24h).toBeDefined();
  });

  it('Rate limiter headers should be set on response', async () => {
    const res = await request(app).get('/api/events');
    expect(res.headers['ratelimit-limit']).toBe('30');
    expect(res.headers['ratelimit-remaining']).toBeDefined();
  });
});

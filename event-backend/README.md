# Event Backend Service

TypeScript & Express RESTful API service providing event management, server-side filtering & pagination, real-time analytics aggregation, and rate-limiting.

---

## Technical Stack

- **Runtime**: Node.js & TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ORM
- **Rate Limiting**: `express-rate-limit` (30 requests / 1 minute per IP)
- **Documentation**: OpenAPI 3.0 via `swagger-ui-express` & `swagger-jsdoc`
- **Testing**: `Vitest` & `Supertest`

---

## Setup & Installation

### Environment Variables
Create a `.env` file in `event-backend`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/event_db
NODE_ENV=development
```

### Installation

```bash
npm install
```

---

## Scripts

```bash
# Start development server with auto-reload
npm run dev

# Seed database with 20 sample Nepal events and relative event times
npm run seed

# Run automated tests (Vitest)
npm test

# Build for production
npm run build

# Start production server
npm start
```

The seeder clears the existing events before inserting the sample data. Event dates are generated relative to the time `npm run seed` starts, so the dashboard can demonstrate events changing from **Upcoming** to **Past** while it is running. The seeded demo includes events scheduled to transition after approximately 10 seconds, 30 seconds, 1 minute, and 3 minutes. Run the command again to reset the dataset and regenerate the relative timestamps.

---

## Architecture Notes

### Folder Structure

```
event-backend/
├── config/
│   ├── db.ts           # Mongoose DB connection handler
│   └── swagger.ts      # OpenAPI 3.0 specification
├── controllers/
│   └── event.controller.ts  # HTTP Request handlers & response formatting
├── models/
│   └── event.model.ts  # Mongoose schema & EventCategory enums
├── routes/
│   ├── index.ts        # Router root (/health, /api prefix)
│   └── event.routes.ts # /api/events endpoint definitions
├── services/
│   └── event.service.ts # Business logic, pagination, date filtering & aggregation
├── tests/
│   ├── api.test.ts        # Integration tests for CRUD & filters
│   └── rateLimit.test.ts  # Integration test for 30 req/min rate limit
├── app.ts              # Express application setup & middleware configuration
├── server.ts           # HTTP server startup script
└── seed.ts             # Database seeder with Nepal locations
```

---

## API Endpoints

### 1. Health Check
- `GET /api/health` -> Returns service health status.

### 2. Events (`/api/events`)
- `GET /api/events` -> List events with pagination and filters.
  - Query Parameters:
    - `page` (number, default: 1)
    - `limit` (number, default: 10)
    - `event_type` (string, e.g. `Technology`, `Conference`, `Workshop`, `Meetup`, `General`)
    - `date_range` (string, e.g. `24h`, `7d`, `30d`, or ISO dates `startDate,endDate`)
- `GET /api/events/:id` -> Get event by ID.
- `POST /api/events` -> Create a new event.
- `PUT /api/events/:id` -> Update an event.
- `DELETE /api/events/:id` -> Delete an event.

### 3. Analytics (`/api/events/analytics`)
- `GET /api/events/analytics` -> Returns aggregate statistics:
  - `totalEvents`
  - `upcomingEvents`
  - `pastEvents`
  - `totalCapacity`
  - `categoryBreakdown`
  - `upcomingCategoryBreakdown`
  - `recentEvents`
  - `eventCountsLast24h`

---

## Swagger API Documentation

Access Swagger UI interactively at: `http://localhost:5000/api-docs`

---

## Upcoming Events by Category

The analytics data includes the upcoming event total and category breakdown used by the dashboard to display scheduled events by category. Upcoming events are determined from their event date relative to the current time.

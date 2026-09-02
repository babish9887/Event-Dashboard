# Event Management & Analytics System

Full-stack Event Management System featuring real-time analytics, server-side pagination, category & date range filtering, rate limiting, and seeded Nepal event data.

The dashboard supports creating new events and deleting existing events with confirmation. Its analytics update automatically every 5 seconds, including event counts by type for events that occurred during the past 24 hours.

---

## Workspace Structure

```
assesment/
├── event-backend/     # Node.js + Express + TypeScript + MongoDB backend
├── event-frontend/    # Next.js 15 (App Router) + React 19 + Tailwind CSS frontend
└── README.md          # Project overview & quickstart guide
```

---

## Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017/event_db` (or via `MONGODB_URI` environment variable)

---

### 1. Backend Setup (`event-backend`)

```bash
cd event-backend
npm install

# Seed the database with 20 sample Nepal events
npm run seed

# Start development server (runs on port 5000)
npm run dev

# Run automated Vitest test suite
npm test
```

The seed command clears the existing events and creates dates relative to the time it runs. This includes demo events that transition from **Upcoming** to **Past** after approximately 10 seconds, 30 seconds, 1 minute, and 3 minutes. Run `npm run seed` again to reset the data and regenerate those relative timestamps.

- **API Base URL**: `http://localhost:5000/api`
- **Swagger Documentation**: `http://localhost:5000/api-docs`

---

### 2. Frontend Setup (`event-frontend`)

```bash
cd event-frontend
npm install

# Start Next.js development server (runs on port 3000)
npm run dev
```

- **Frontend Application**: `http://localhost:3000`

---

## Architecture Overview

### Backend (`event-backend`)
- **Framework**: Express.js with TypeScript (`tsc` & `ts-node-dev`).
- **Database**: MongoDB with Mongoose (`IEvent` schema with category enums).
- **Security & Rate Limiting**: `express-rate-limit` enforcing 30 requests per minute per IP.
- **Testing**: `Vitest` + `Supertest` integration tests covering CRUD, filters, pagination, analytics, and rate limit enforcement.
- **API Documentation**: Interactive Swagger UI at `/api-docs`.

### Frontend (`event-frontend`)
- **Framework**: Next.js 15 (App Router) with React 19 & TypeScript.
- **State Management & Polling**: React Query (`@tanstack/react-query`) polling analytics and events every 5 seconds.
- **UI Components**: Shadcn UI + Radix primitives + Lucide icons + Tailwind CSS.
- **Features**:
  - Real-time Analytics Cards (Total Events, Upcoming, Past, Capacity, 24h Velocity).
  - Server-side Paginated Event Grid.
  - Create new events and delete existing events from the dashboard.
  - Category / Event-Type Filter dropdown.
  - Preset & Custom Date Range Picker (using Shadcn Popover & Calendar).
  - Dark / Light Mode Toggle (`next-themes`).

## Upcoming Events by Category

The dashboard displays upcoming events grouped by category, making it easy to compare scheduled Conferences, Meetups, Workshops, Technology events, and General events. The grouped results update automatically as event dates change.

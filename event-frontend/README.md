# Event Frontend Application

Next.js 15 App Router web interface for the Event Management & Analytics Dashboard.

The dashboard includes controls for creating new events and deleting existing events with confirmation. Analytics refresh every 5 seconds and show past event totals by category for the last 24 hours.

---

## Technical Stack

- **Framework**: Next.js 15 (App Router) & React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Shadcn UI
- **Data Fetching & Polling**: TanStack React Query (`@tanstack/react-query`)
- **Theme**: `next-themes` (Dark/Light mode support)
- **Icons**: `lucide-react`

---

## Setup & Installation

### Environment Variables
Create a `.env` file in `event-frontend`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Installation

```bash
npm install
```

---

## Scripts

```bash
# Start development server
npm run dev

# Run TypeScript typecheck
npm run typecheck

# Build for production
npm run build

# Start production build
npm start
```

---

## Architecture & Features

### Component Architecture

```
event-frontend/
├── app/
│   ├── layout.tsx          # Root layout with QueryProvider & ThemeProvider
│   ├── page.tsx            # Main Dashboard Page (Overview & Events)
│   └── globals.css         # Global CSS styles & Tailwind configuration
├── components/
│   ├── Navbar.tsx          # Navigation header with Dark/Light theme toggle & New Event modal button
│   ├── AnalyticsCards.tsx  # Overview stat cards & category breakdown charts
│   ├── ActivityFeed.tsx    # Event grid with category & date range filters
│   ├── CreateEventModal.tsx# Event creation modal dialog
│   ├── Paginator.tsx       # Server-side pagination controls (Previous / Next / Page Indicator)
│   └── ui/                 # Shadcn UI primitive components (Button, Card, Select, Popover, Calendar, etc.)
├── hooks/
│   └── useEvents.ts        # React Query hooks with 5-second auto-polling
├── lib/
│   ├── api.ts              # API client methods (fetchEvents, fetchAnalytics, createEvent, deleteEvent)
│   ├── axios.ts            # Axios instance with base configuration
│   └── constants.ts        # Shared constants (Categories, Limits, Preset Date Ranges, Form Defaults)
└── types/
    └── event.ts            # TypeScript interfaces and types
```

---

## Features

- **Real-Time Polling**: Auto-refreshes events and analytics every 5 seconds using React Query.
- **Server-Side Pagination & Filtering**: Filter events by Category and Date Range with immediate server-side fetch.
- **Custom Date Range Picker**: Popover calendar date picker supporting custom date range bounds.
- **Dark & Light Mode**: Theme toggle button in the Navbar with system default detection.

### Upcoming Events by Category

The dashboard shows upcoming events through the category breakdown, helping users compare scheduled Conferences, Meetups, Workshops, Technology events, and General events. This view refreshes automatically every 5 seconds as event dates move closer or pass.

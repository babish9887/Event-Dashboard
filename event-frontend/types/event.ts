import { EVENT_CATEGORIES, CATEGORY_FILTER_OPTIONS } from '@/lib/constants';

export { EVENT_CATEGORIES, CATEGORY_FILTER_OPTIONS };

export type EventCategory = (typeof EVENT_CATEGORIES)[number];
export type CategoryFilterOption = (typeof CATEGORY_FILTER_OPTIONS)[number];

export interface Event {
  _id: string;
  title: string;
  description?: string;
  date: string;
  location: string;
  category: EventCategory;
  capacity: number;
  organizer?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
}

export interface EventCountLast24h {
  event_type: string;
  count: number;
}

export interface AnalyticsData {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  totalCapacity: number;
  categoryBreakdown: CategoryBreakdown[];
  upcomingCategoryBreakdown?: CategoryBreakdown[];
  recentEvents: Event[];
  eventCountsLast24h?: EventCountLast24h[];
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface EventFilters {
  page?: number;
  limit?: number;
  category?: CategoryFilterOption;
  event_type?: string;
  date_range?: string;
  search?: string;
}

export interface PaginatedEventsResponse {
  events: Event[];
  pagination: PaginationInfo;
}

export interface CreateEventInput {
  title: string;
  description?: string;
  date: string;
  location: string;
  category?: EventCategory;
  capacity?: number;
  organizer?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  pagination?: PaginationInfo;
  message?: string;
}

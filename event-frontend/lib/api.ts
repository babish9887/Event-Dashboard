import apiClient from '@/lib/axios';
import {
  ApiResponse,
  Event,
  AnalyticsData,
  CreateEventInput,
  EventFilters,
  PaginatedEventsResponse,
} from '@/types/event';

export async function fetchEvents(
  filters?: EventFilters
): Promise<PaginatedEventsResponse> {
  const params: Record<string, string | number> = {};

  if (filters?.page) params.page = filters.page;
  if (filters?.limit) params.limit = filters.limit;
  if (filters?.event_type && filters.event_type !== 'All')
    params.event_type = filters.event_type;
  if (filters?.category && filters.category !== 'All')
    params.event_type = filters.category;
  if (filters?.date_range && filters.date_range !== 'all')
    params.date_range = filters.date_range;
  if (filters?.search?.trim()) params.search = filters.search.trim();

  const { data } = await apiClient.get<
    ApiResponse<Event[]> & { pagination: PaginatedEventsResponse['pagination'] }
  >('/events', { params });

  return {
    events: data.data || [],
    pagination: data.pagination ?? {
      total: 0,
      page: filters?.page ?? 1,
      limit: filters?.limit ?? 10,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
  };
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const { data } = await apiClient.get<ApiResponse<AnalyticsData>>(
    '/events/analytics'
  );
  return data.data;
}

export async function createEvent(payload: CreateEventInput): Promise<Event> {
  const { data } = await apiClient.post<ApiResponse<Event>>('/events', payload);
  return data.data;
}

export async function deleteEvent(id: string): Promise<void> {
  await apiClient.delete(`/events/${id}`);
}

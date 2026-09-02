import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  fetchEvents,
  fetchAnalytics,
  createEvent,
  deleteEvent,
} from '@/lib/api';
import {
  EventFilters,
  CreateEventInput,
  PaginatedEventsResponse,
  AnalyticsData,
} from '@/types/event';

export function useEvents(filters?: EventFilters) {
  return useQuery<PaginatedEventsResponse>({
    queryKey: ['events', filters],
    queryFn: () => fetchEvents(filters),
    refetchInterval: 5000,
    placeholderData: (prev) => prev,
  });
}

export function useAnalytics() {
  return useQuery<AnalyticsData>({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics,
    refetchInterval: 5000,
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEventInput) => createEvent(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'] });
      qc.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'] });
      qc.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

import { TrendingUp, CalendarCheck, CalendarX, Users } from 'lucide-react';
import { EventCategory } from '@/types/event';

export const EVENT_CATEGORIES: string[] = [
  'Technology',
  'Conference',
  'Workshop',
  'Meetup',
  'General',
];

export const CATEGORY_FILTER_OPTIONS = ['All', ...EVENT_CATEGORIES] as const;

export const DATE_PRESETS = [
  { value: 'all', label: 'All Time' },
  { value: '24h', label: 'Last 24h' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'custom', label: 'Custom Range…' },
];

export const LIMITS = [6, 9, 12];

export const STAT_CONFIG = [
  { key: 'totalEvents', label: 'Total Events', icon: CalendarCheck },
  { key: 'upcomingEvents', label: 'Upcoming', icon: TrendingUp },
  { key: 'pastEvents', label: 'Past', icon: CalendarX },
  { key: 'totalCapacity', label: 'Total Capacity', icon: Users, format: true },
];

export const DEFAULT_EVENT_FORM = {
  title: '',
  description: '',
  date: '',
  location: '',
  category: 'Technology' as EventCategory,
  capacity: 100,
  organizer: '',
};

'use client';

import { useState } from 'react';
import { useEvents, useDeleteEvent } from '@/hooks/useEvents';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Calendar } from '@/components/ui/calendar';
import type { DateRange } from 'react-day-picker';
import Paginator from '@/components/Paginator';
import { CategoryFilterOption, Event } from '@/types/event';
import { DATE_PRESETS, LIMITS, CATEGORY_FILTER_OPTIONS } from '@/lib/constants';
import {
  MapPin,
  Calendar as CalIcon,
  Users,
  Trash2,
  RefreshCw,
  Filter,
} from 'lucide-react';

export default function EventsSection() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [category, setCategory] = useState<CategoryFilterOption>('All');

  const [dateRangePreset, setDateRangePreset] = useState('all');
  const [appliedRange, setAppliedRange] = useState<{ from?: Date; to?: Date }>({});
  const [tempRange, setTempRange] = useState<{ from?: Date; to?: Date }>({});
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // State for confirm delete modal
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  let apiDateRange = dateRangePreset;
  if (dateRangePreset === 'custom' && appliedRange.from && appliedRange.to) {
    apiDateRange = `${appliedRange.from.toISOString()},${appliedRange.to.toISOString()}`;
  }

  const { data, isLoading, isFetching, isError, refetch } = useEvents({
    page,
    limit,
    category,
    date_range: apiDateRange,
  });

  const deleteMutation = useDeleteEvent();
  const events = data?.events ?? [];
  const pagination = data?.pagination;

  const handleDatePresetChange = (preset: string) => {
    setPage(1);
    setDateRangePreset(preset);
    if (preset === 'custom') {
      setTempRange(appliedRange);
      setIsPopoverOpen(true);
    } else {
      setAppliedRange({});
      setIsPopoverOpen(false);
    }
  };

  const handleApplyCustomRange = () => {
    if (tempRange.from && tempRange.to) {
      setAppliedRange(tempRange);
      setPage(1);
      setIsPopoverOpen(false);
    }
  };

  const handleClearCustomRange = () => {
    setTempRange({});
    setAppliedRange({});
    setDateRangePreset('all');
    setIsPopoverOpen(false);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      deleteMutation.mutate(eventToDelete._id, {
        onSettled: () => setEventToDelete(null),
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Filter className="size-4 shrink-0" />
              <span>Filters</span>
            </div>

            <Select
              value={category}
              onValueChange={(val) => {
                setPage(1);
                setCategory(val as CategoryFilterOption);
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_FILTER_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <div className="flex items-center gap-2">
                <Select value={dateRangePreset} onValueChange={handleDatePresetChange}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    {DATE_PRESETS.map((d) => (
                      <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {dateRangePreset === 'custom' && (
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs">
                      <CalIcon className="size-3.5 mr-1" />
                      {appliedRange.from && appliedRange.to
                        ? `${appliedRange.from.toLocaleDateString()} - ${appliedRange.to.toLocaleDateString()}`
                        : 'Pick Dates'}
                    </Button>
                  </PopoverTrigger>
                )}
              </div>

              <PopoverContent className="w-auto p-3" align="start">
                <div className="flex items-center justify-between text-xs font-semibold pb-2 border-b mb-2">
                  <span>Select Custom Date Range</span>
                  {tempRange.from && (
                    <span className="text-muted-foreground font-normal">
                      {tempRange.from.toLocaleDateString()}
                      {tempRange.to ? ` → ${tempRange.to.toLocaleDateString()}` : ' (select end date)'}
                    </span>
                  )}
                </div>
                <Calendar
                  mode="range"
                  selected={tempRange as DateRange}
                  onSelect={(range: DateRange | undefined) => setTempRange(range || {})}
                  numberOfMonths={1}
                />
                <div className="flex items-center justify-between pt-2 border-t mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={handleClearCustomRange}
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs"
                    disabled={!tempRange.from || !tempRange.to}
                    onClick={handleApplyCustomRange}
                  >
                    Apply Range
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Select
              value={String(limit)}
              onValueChange={(v) => { setPage(1); setLimit(Number(v)); }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LIMITS.map((l) => (
                  <SelectItem key={l} value={String(l)}>{l} / page</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="ml-auto flex items-center gap-2">
              {pagination && (
                <span className="text-xs text-muted-foreground tabular-nums">
                  {pagination.total} event{pagination.total !== 1 ? 's' : ''}
                </span>
              )}
              <Button variant="ghost" size="icon-sm" onClick={() => refetch()} title="Refresh">
                <RefreshCw className={isFetching ? 'animate-spin ' : ''} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-sm font-medium">Connection failed</p>
            <p className="text-xs text-muted-foreground mt-1">
              Make sure the backend is running on port 5000.
            </p>
            <Button size="sm" variant="outline" className="mt-4" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-sm font-medium">No events found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your filters or create a new event.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => {
            const d = new Date(event.date);
            const isPast = d < new Date();
            return (
              <Card key={event._id} className="group flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="secondary" className="text-xs font-medium">
                      {event.category || 'General'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="opacity-0 group-hover:opacity-100 shrink-0 hover:text-destructive transition-opacity"
                      onClick={() => setEventToDelete(event)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                  <CardTitle className="text-base leading-snug line-clamp-2 mt-1">
                    {event.title}
                  </CardTitle>
                  {event.description && (
                    <CardDescription className="line-clamp-2 text-xs mt-0.5">
                      {event.description}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardFooter className="flex flex-col items-start gap-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5 w-full">
                    <CalIcon className="size-3 shrink-0" />
                    <span className={isPast ? 'line-through opacity-50' : 'font-medium text-foreground'}>
                      {d.toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    {isPast && (
                      <Badge variant="secondary" className="ml-auto text-xs py-0">Past</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="size-3 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <Users className="size-3" />
                      <span className="tabular-nums">{event.capacity}</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <Paginator pagination={pagination} onPageChange={setPage} />
      )}

      {/* Shadcn Delete Confirm Dialog */}
      <AlertDialog
        open={Boolean(eventToDelete)}
        onOpenChange={(open) => {
          if (!open) setEventToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{eventToDelete?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete Event'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

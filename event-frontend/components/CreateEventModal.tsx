'use client';

import { FormEvent, useState } from 'react';
import { useCreateEvent } from '@/hooks/useEvents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Calendar } from '@/components/ui/calendar';
import { EVENT_CATEGORIES, DEFAULT_EVENT_FORM } from '@/lib/constants';
import { X, Calendar as CalendarIcon, Clock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateEventModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState(DEFAULT_EVENT_FORM);
  const [error, setError] = useState('');

  // Date and Time picker state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    form.date ? new Date(form.date) : undefined
  );
  const [selectedTime, setSelectedTime] = useState<string>('09:00');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const createMutation = useCreateEvent();

  if (!isOpen) return null;

  const update = (field: string, value: string | number) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    const [hours, minutes] = selectedTime.split(':');
    date.setHours(Number(hours) || 0, Number(minutes) || 0);
    update('date', date.toISOString());
  };

  const handleTimeChange = (timeStr: string) => {
    setSelectedTime(timeStr);
    if (selectedDate) {
      const [hours, minutes] = timeStr.split(':');
      const updated = new Date(selectedDate);
      updated.setHours(Number(hours) || 0, Number(minutes) || 0);
      setSelectedDate(updated);
      update('date', updated.toISOString());
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.location) {
      setError('Title, date, and location are required.');
      return;
    }
    setError('');
    createMutation.mutate(
      {
        ...form,
        date: form.date,
        capacity: Number(form.capacity),
        organizer: form.organizer || 'Admin',
      },
      {
        onSuccess: () => {
          setForm(DEFAULT_EVENT_FORM);
          setSelectedDate(undefined);
          setSelectedTime('09:00');
          onClose();
        },
        onError: (err: Error) => setError(err.message || 'Failed to create event'),
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl w-full max-w-md shadow-xl ring-1 ring-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-semibold">New Event</p>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
          {error && (
            <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Field label="Title *">
            <Input
              required
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g. AI Summit 2026"
            />
          </Field>

          {/* Full Width Shadcn Date & Time Picker */}
          <Field label="Date & Time *">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal text-xs h-9 px-3"
                >
                  <CalendarIcon className="mr-2 size-3.5 text-muted-foreground" />
                  {selectedDate ? (
                    <span>
                      {selectedDate.toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      at {selectedTime}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Pick a date & time</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                />
                <div className="flex items-center gap-2 pt-2 border-t mt-2">
                  <Clock className="size-3.5 text-muted-foreground shrink-0" />
                  <span className="text-xs font-medium text-muted-foreground">Time:</span>
                  <Input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Button
                    size="sm"
                    className="text-xs ml-auto"
                    onClick={() => setIsCalendarOpen(false)}
                  >
                    Done
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <Select value={form.category} onValueChange={(v) => update('category', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_CATEGORIES.map((c: string) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Capacity">
              <Input
                type="number"
                min={1}
                value={form.capacity}
                onChange={(e) => update('capacity', e.target.value)}
              />
            </Field>
          </div>

          <Field label="Location *">
            <Input
              required
              value={form.location}
              onChange={(e) => update('location', e.target.value)}
              placeholder="City, Venue"
            />
          </Field>

          <Field label="Description">
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Short description…"
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:border-ring placeholder:text-muted-foreground transition-colors resize-none"
            />
          </Field>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Saving…' : 'Save Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

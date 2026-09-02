import { Schema, model, Document } from 'mongoose';

export const EVENT_CATEGORIES = [
  'Technology',
  'Conference',
  'Workshop',
  'Meetup',
  'General',
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export interface IEvent extends Document {
  title: string;
  description?: string;
  date: Date;
  location: string;
  category: EventCategory;
  capacity?: number;
  organizer?: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: {
        values: EVENT_CATEGORIES,
        message: `Category must be one of: ${EVENT_CATEGORIES.join(', ')}`,
      },
      default: 'General',
      trim: true,
    },
    capacity: {
      type: Number,
      default: 100,
      min: [1, 'Capacity must be at least 1'],
    },
    organizer: {
      type: String,
      trim: true,
      default: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);

export const EventModel = model<IEvent>('Event', eventSchema);

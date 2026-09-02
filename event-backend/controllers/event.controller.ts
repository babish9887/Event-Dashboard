import { Request, Response } from 'express';
import { eventService } from '../services/event.service';
import { isValidObjectId } from 'mongoose';

export const getEvents = async (req: Request, res: Response) => {
  try {
    const { page, limit, event_type, date_range } = req.query;

    const result = await eventService.getEvents({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      event_type: event_type as string,
      date_range: date_range as string,
    });

    res.status(200).json({
      success: true,
      count: result.events.length,
      pagination: result.pagination,
      data: result.events,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!isValidObjectId(id)) {
      res.status(400).json({ success: false, message: 'Invalid event ID format' });
      return;
    }

    const event = await eventService.getEventById(id);
    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const event = await eventService.createEvent(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!isValidObjectId(id)) {
      res.status(400).json({ success: false, message: 'Invalid event ID format' });
      return;
    }

    const updatedEvent = await eventService.updateEvent(id, req.body);
    if (!updatedEvent) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }
    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!isValidObjectId(id)) {
      res.status(400).json({ success: false, message: 'Invalid event ID format' });
      return;
    }

    const deletedEvent = await eventService.deleteEvent(id);
    if (!deletedEvent) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const stats = await eventService.getAnalyticsStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

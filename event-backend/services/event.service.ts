import { EventModel, IEvent } from '../models/event.model';

export interface EventQueryParams {
  page?: number;
  limit?: number;
  event_type?: string;
  date_range?: string;
}

export class EventService {
  async getEvents(queryParams: EventQueryParams = {}) {
    const page = Math.max(1, Number(queryParams.page) || 1);
    const limit = Math.max(1, Number(queryParams.limit) || 10);
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (queryParams.event_type && queryParams.event_type !== 'All') {
      filter.category = { $regex: new RegExp(`^${queryParams.event_type}$`, 'i') };
    }

    if (queryParams.date_range) {
      const now = new Date();
      if (queryParams.date_range === '24h') {
        filter.date = { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) };
      } else if (queryParams.date_range === '7d') {
        filter.date = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
      } else if (queryParams.date_range === '30d') {
        filter.date = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
      } else if (queryParams.date_range.includes(',')) {
        const [start, end] = queryParams.date_range.split(',');
        filter.date = { $gte: new Date(start), $lte: new Date(end) };
      }
    }

    const [events, total] = await Promise.all([
      EventModel.find(filter).sort({ date: -1, createdAt: -1 }).skip(skip).limit(limit),
      EventModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      events,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async getAllEvents(): Promise<IEvent[]> {
    return await EventModel.find().sort({ createdAt: -1 });
  }

  async getEventById(id: string) {
    return await EventModel.findById(id);
  }

  async createEvent(eventData: Partial<IEvent>) {
    const event = new EventModel(eventData);
    return await event.save();
  }

  async updateEvent(id: string, updateData: Partial<IEvent>) {
    return await EventModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteEvent(id: string) {
    return await EventModel.findByIdAndDelete(id);
  }

async getAnalyticsStats() {
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [
    totalEvents,
    upcomingEvents,
    pastEvents,
    capacityResult,
    categoryBreakdown,
    upcomingCategoryBreakdown,
    recentEvents,
    eventCountsLast24h,
  ] = await Promise.all([
    EventModel.countDocuments(),
    EventModel.countDocuments({ date: { $gte: now } }),
    EventModel.countDocuments({ date: { $lt: now } }),

    EventModel.aggregate([
      { $group: { _id: null, total: { $sum: '$capacity' } } },
    ]),

    EventModel.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]).then(rows => rows.map(r => ({ category: r._id, count: r.count }))),

    EventModel.aggregate([
      { $match: { date: { $gte: now } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]).then(rows => rows.map(r => ({ category: r._id, count: r.count }))),

    EventModel.find().sort({ createdAt: -1 }).limit(5),

    EventModel.aggregate([
      { $match: { date: { $gte: last24h, $lt: now } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]).then(rows => rows.map(r => ({ event_type: r._id, count: r.count }))),
  ]);

  return {
    totalEvents,
    upcomingEvents,
    pastEvents,
    totalCapacity: capacityResult[0]?.total ?? 0,
    categoryBreakdown,
    upcomingCategoryBreakdown,
    recentEvents,
    eventCountsLast24h,
  };
}
}

export const eventService = new EventService();

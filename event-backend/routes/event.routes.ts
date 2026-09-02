import { Router } from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getAnalytics,
} from '../controllers/event.controller';

const router = Router();

router.route('/')
  .get(getEvents)
  .post(createEvent);

router.route('/analytics').get(getAnalytics);



router.route('/:id')
  .get(getEventById)
  .put(updateEvent)
  .delete(deleteEvent);



export default router;


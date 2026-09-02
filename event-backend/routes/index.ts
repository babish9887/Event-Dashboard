import { Router } from 'express';
import eventRoutes from './event.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Event Backend API Running Good!',
    timestamp: new Date().toISOString(),
  });
});

router.use('/events', eventRoutes);

export default router;

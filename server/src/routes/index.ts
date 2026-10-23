import { Router } from 'express';
import { healthRouter } from './health.routes';

const router = Router();

// Mount sub-routers
router.use('/', healthRouter);

export { router as apiRouter };

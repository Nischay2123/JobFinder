import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth';
import * as jobsController from './jobs.controller';

const router = Router();

// Sync Trigger
router.post('/jobs/sync', authenticate, jobsController.startSync);

// Status Polling
router.get('/syncs/:syncId', authenticate, jobsController.getSyncStatus);

// Failed Job Replay
router.post('/failed-jobs/:id/replay', authenticate, jobsController.replayFailedJob);

// Fetch All Jobs
router.get('/jobs', authenticate, jobsController.getJobs);

export { router as jobsRoutes };

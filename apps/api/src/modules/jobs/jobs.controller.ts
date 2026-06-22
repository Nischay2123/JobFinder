import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../shared/db/prisma';
import { AppError } from '../../shared/utils/AppError';
import { enqueueJobSync, enqueueFailedJobReplay } from './jobs.queue';
import { JobRepository } from './jobs.repository';

/**
 * Trigger job sync for the authenticated user.
 * Limit to one active sync per user.
 */
export const startSync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError('Unauthorized access', 401);
    }

    // 1. Check for existing active syncs
    const activeSync = await prisma.userSync.findFirst({
      where: {
        userId,
        status: {
          in: ['SYNC_REQUESTED', 'FETCHING', 'NORMALIZING'],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 2. If an active sync is found, return it directly without starting a new one
    if (activeSync) {
      res.status(200).json({
        syncId: activeSync.id,
        status: 'already_running',
      });
      return;
    }

    // 3. Create a new sync record
    const newSync = await prisma.userSync.create({
      data: {
        userId,
        status: 'SYNC_REQUESTED',
      },
    });

    // 4. Enqueue background job
    await enqueueJobSync(userId, newSync.id);

    res.status(201).json({
      syncId: newSync.id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get the status and progress metrics of a sync.
 */
export const getSyncStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const syncId = req.params['syncId'] as string;

    const sync = await prisma.userSync.findUnique({
      where: { id: syncId },
    });

    if (!sync) {
      throw new AppError('Sync record not found', 404);
    }

    res.status(200).json({
      id: sync.id,
      status: sync.status,
      jobsFound: sync.jobsFound,
      jobsAdded: sync.jobsAdded,
      errorMessage: sync.errorMessage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Replay a failed job from the FailedJob registry.
 */
export const replayFailedJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'] as string;

    const failedJob = await prisma.failedJob.findUnique({
      where: { id },
    });

    if (!failedJob) {
      throw new AppError('Failed job record not found', 404);
    }

    // Requeue using the connection manager
    await enqueueFailedJobReplay(failedJob.jobType, failedJob.payload);

    // Update statistics
    const updatedFailedJob = await prisma.failedJob.update({
      where: { id },
      data: {
        replayCount: failedJob.replayCount + 1,
        replayedAt: new Date(),
      },
    });

    res.status(200).json({
      message: 'Failed job replayed successfully',
      failedJobId: updatedFailedJob.id,
      replayCount: updatedFailedJob.replayCount,
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Retrieve stored jobs from PostgreSQL.
 */
export const getJobs = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const jobs = await JobRepository.findActiveJobs({ take: 50 });

    res.status(200).json({ jobs });
  } catch (error) {
    next(error);
  }
};


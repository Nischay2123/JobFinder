import { Queue, Worker, Job as BullJob } from 'bullmq';
import { JobSource } from '@prisma/client';
import { RedisManager } from '../../shared/redis/redis.manager';
import { prisma } from '../../shared/db/prisma';
import { createLogger } from '@job-finder/logger';

const logger = createLogger('CleanupWorker');
const connection = RedisManager.getConnection('queue');

export const cleanupQueue = new Queue('job-cleanup', { connection: connection as any });

export const scheduleCleanupJob = async () => {
  // Add a repeatable daily cleanup job
  await cleanupQueue.add(
    'cleanup-jobs',
    {},
    {
      repeat: {
        pattern: '0 2 * * *',
      },
    }
  );
  logger.info('[CleanupWorker] Scheduled repeatable cleanup job (cron: 0 2 * * *)');
};

export const cleanupWorker = new Worker(
  'job-cleanup',
  async (job: BullJob) => {
    logger.info(`[CleanupWorker] Processing cleanup job ${job.id}`);
    const redis = RedisManager.getConnection('cache');
    const lockKey = 'cleanup:lock';
    const startTime = Date.now();

    // 1. Acquire Distributed Lock (1-hour TTL)
    const acquired = await redis.set(lockKey, 'locked', 'EX', 3600, 'NX');
    if (acquired !== 'OK') {
      logger.info('[CleanupWorker] Cleanup distributed lock is already held. Skipping this execution.');
      return { skipped: true };
    }

    let totalMarkedInactive = 0;
    let totalSoftDeleted = 0;
    const skippedSources: string[] = [];

    try {
      // 2. Find currently active sync runs
      const activeSyncs = await prisma.syncRun.findMany({
        where: { status: 'RUNNING' },
        select: { source: true },
      });
      const activeSources = activeSyncs.map((s: { source: JobSource }) => s.source);

      const sources = Object.values(JobSource);

      for (const src of sources) {
        // Skip cleanup for sources that are currently syncing
        if (activeSources.includes(src)) {
          logger.info(`[CleanupWorker] Skipping source ${src} because a sync run is currently active.`);
          skippedSources.push(src);
          continue;
        }

        // Find the latest successful SyncRun for this source
        const latestSuccess = await prisma.syncRun.findFirst({
          where: {
            source: src,
            status: 'SUCCESS',
          },
          orderBy: {
            completedAt: 'desc',
          },
        });

        if (!latestSuccess || !latestSuccess.completedAt) {
          logger.info(`[CleanupWorker] Skipping source ${src} because no successful sync run was found.`);
          skippedSources.push(src);
          continue;
        }

        const latestSuccessTime = latestSuccess.completedAt;

        // 14 days ago threshold relative to latest successful sync
        const threshold14 = new Date(
          Math.min(Date.now() - 14 * 24 * 60 * 60 * 1000, latestSuccessTime.getTime())
        );

        // 30 days ago threshold relative to latest successful sync
        const threshold30 = new Date(
          Math.min(Date.now() - 30 * 24 * 60 * 60 * 1000, latestSuccessTime.getTime())
        );

        // Task 1: Mark Inactive in batches of 500
        let markedInactive = 0;
        let cursor: string | undefined = undefined;

        while (true) {
          const jobs: { id: string }[] = await prisma.job.findMany({
            where: {
              source: src,
              status: 'ACTIVE',
              lastSeenAt: { lt: threshold14 },
            },
            select: { id: true },
            take: 500,
            orderBy: { id: 'asc' },
            ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
          });

          if (jobs.length === 0) break;

          const ids = jobs.map((j) => j.id);
          await prisma.job.updateMany({
            where: { id: { in: ids } },
            data: { status: 'INACTIVE' },
          });

          markedInactive += ids.length;
          cursor = ids[ids.length - 1];
        }

        // Task 2: Soft Delete in batches of 500
        let softDeleted = 0;
        cursor = undefined;

        while (true) {
          const jobs: { id: string }[] = await prisma.job.findMany({
            where: {
              source: src,
              status: 'INACTIVE',
              lastSeenAt: { lt: threshold30 },
            },
            select: { id: true },
            take: 500,
            orderBy: { id: 'asc' },
            ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
          });

          if (jobs.length === 0) break;

          const ids = jobs.map((j) => j.id);
          await prisma.job.updateMany({
            where: { id: { in: ids } },
            data: {
              status: 'DELETED',
              deletedAt: new Date(),
            },
          });

          softDeleted += ids.length;
          cursor = ids[ids.length - 1];
        }

        totalMarkedInactive += markedInactive;
        totalSoftDeleted += softDeleted;

        logger.info(
          {
            source: src,
            markedInactive,
            softDeleted,
            latestSuccessTime,
          },
          'cleanup_source_complete'
        );
      }

      const durationMs = Date.now() - startTime;
      logger.info(
        {
          markedInactive: totalMarkedInactive,
          softDeleted: totalSoftDeleted,
          skippedSources,
          durationMs,
        },
        'cleanup_run_complete'
      );

      return {
        markedInactive: totalMarkedInactive,
        softDeleted: totalSoftDeleted,
        skippedSources,
      };
    } catch (err: any) {
      logger.error(`[CleanupWorker] Cleanup job failed: ${err.message}`, err.stack);
      throw err;
    } finally {
      // 3. Release Distributed Lock
      await redis.del(lockKey);
    }
  },
  {
    connection: connection as any,
    concurrency: 1,
  }
);

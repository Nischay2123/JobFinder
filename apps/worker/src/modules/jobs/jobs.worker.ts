import { Worker, Job as BullJob } from 'bullmq';
import { JobSource } from '@prisma/client';
import { RedisManager } from '../../shared/redis/redis.manager';
import { SyncProcessor } from './processors/sync.processor';
import { FailedJobService } from './services/failed-job.service';
import { SyncService } from './services/sync.service';
import { ConnectorRegistry } from './registry/connector.registry';
import { prisma } from '../../shared/db/prisma';

const connection = RedisManager.getConnection('queue');
const syncProcessor = new SyncProcessor();
const failedJobService = new FailedJobService();
const syncService = new SyncService();

async function runSyncForSource(
  syncId: string,
  src: JobSource
): Promise<{ jobsFound: number; jobsAdded: number; jobsUpdated: number; errorsCount: number } | null> {
  const redis = RedisManager.getConnection('cache');
  const lockKey = `sync:${src}:lock`;

  // 1. Acquire Lock (30-minute TTL)
  const acquired = await redis.set(lockKey, 'locked', 'PX', 30 * 60 * 1000, 'NX');
  if (acquired !== 'OK') {
    console.log(`[Worker] Sync lock for ${src} is already held. Skipping this run.`);
    return null;
  }

  let syncRun;
  try {
    // 2. Create SyncRun
    syncRun = await prisma.syncRun.create({
      data: {
        source: src,
        status: 'RUNNING',
        startedAt: new Date(),
      },
    });

    // 3. Execute SyncProcessor
    const res = await syncProcessor.process(syncId, src);

    // 4. Determine status
    let finalStatus: 'SUCCESS' | 'PARTIAL' | 'FAILED' = 'SUCCESS';
    if (res.errorsCount > 0) {
      if (res.jobsFound > 0) {
        finalStatus = 'PARTIAL';
      } else {
        finalStatus = 'FAILED';
      }
    }

    // 5. Update SyncRun
    await prisma.syncRun.update({
      where: { id: syncRun.id },
      data: {
        status: finalStatus,
        jobsSeen: res.jobsFound,
        jobsAdded: res.jobsAdded,
        jobsUpdated: res.jobsUpdated,
        errorsCount: res.errorsCount,
        completedAt: new Date(),
      },
    });

    return res;
  } catch (err: any) {
    console.error(`[Worker] Error during sync for source ${src}:`, err.message);
    if (syncRun) {
      await prisma.syncRun.update({
        where: { id: syncRun.id },
        data: {
          status: 'FAILED',
          errorMessage: err.message,
          errorsCount: 1,
          completedAt: new Date(),
        },
      });
    }
    throw err;
  } finally {
    // 6. Release Lock
    await redis.del(lockKey);
  }
}

export const jobsWorker = new Worker(
  'job-sync',
  async (job: BullJob) => {
    const { userId, syncId, source } = job.data;
    console.log(`[Worker] Processing job ${job.id} for user ${userId}, sync ${syncId}`);

    if (source) {
      const jobSource = source as JobSource;
      const res = await runSyncForSource(syncId, jobSource);
      if (!res) {
        return { skipped: true };
      }
      return { jobsFound: res.jobsFound, jobsAdded: res.jobsAdded, jobsUpdated: res.jobsUpdated };
    } else {
      // Full sync: run all registered connectors dynamically
      const sources = ConnectorRegistry.getRegisteredSources();
      let totalFound = 0;
      let totalAdded = 0;
      let totalUpdated = 0;
      const errors: string[] = [];

      for (const src of sources) {
        try {
          console.log(`[Worker] Running sync for source: ${src}`);
          const res = await runSyncForSource(syncId, src);
          if (res) {
            totalFound += res.jobsFound;
            totalAdded += res.jobsAdded;
            totalUpdated += res.jobsUpdated;
          }
        } catch (err: any) {
          console.error(`[Worker] Connector ${src} failed during full sync:`, err.message);
          errors.push(`${src}: ${err.message}`);
        }
      }

      // Update final cumulative metrics and set status to COMPLETED on the UserSync record
      await prisma.userSync.update({
        where: { id: syncId },
        data: {
          status: 'COMPLETED',
          jobsFound: totalFound,
          jobsAdded: totalAdded,
          completedAt: new Date(),
        },
      });

      if (errors.length === sources.length && sources.length > 0) {
        throw new Error(`All sync sources failed:\n${errors.join('\n')}`);
      } else if (errors.length > 0) {
        console.warn(`[Worker] Some sources failed during full sync:\n${errors.join('\n')}`);
      }

      return { jobsFound: totalFound, jobsAdded: totalAdded, jobsUpdated: totalUpdated };
    }
  },
  {
    connection: connection as any,
    concurrency: 1,
  }
);

jobsWorker.on('failed', async (job, err) => {
  if (job) {
    const { syncId } = job.data;
    console.error(`[Worker] Job ${job.id} failed:`, err);

    if (syncId) {
      await syncService.fail(syncId, err.message || 'Background processing failed');
    }

    await failedJobService.log(
      job.name || 'sync-jobs',
      job.data,
      err.message || 'Background processing failed',
      err.stack
    );
  }
});

jobsWorker.on('active', (job) => console.log(`[Worker] Job ${job.id} became active`));
jobsWorker.on('completed', (job, result) => console.log(`[Worker] Job ${job.id} completed:`, result));

import { Worker, Job as BullJob } from 'bullmq';
import { JobSource } from '@prisma/client';
import { RedisManager } from '../../shared/redis/redis.manager';
import { SyncProcessor } from './processors/sync.processor';
import { FailedJobService } from './services/failed-job.service';
import { SyncService } from './services/sync.service';

const connection = RedisManager.getConnection('queue');
const syncProcessor = new SyncProcessor();
const failedJobService = new FailedJobService();
const syncService = new SyncService();

export const jobsWorker = new Worker(
  'job-sync',
  async (job: BullJob) => {
    const { userId, syncId, source } = job.data;
    console.log(`[Worker] Processing job ${job.id} for user ${userId}, sync ${syncId}`);
    
    const jobSource = (source as JobSource) || JobSource.YC;
    return await syncProcessor.process(syncId, jobSource);
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

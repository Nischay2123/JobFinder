import { Queue } from 'bullmq';
import { RedisManager } from '../../shared/redis/redis.manager';

const connection = RedisManager.getConnection('queue');

// Instantiate the job-sync queue with default retry rules
export const jobSyncQueue = new Queue('job-sync', {
  connection: connection as any,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000, // 5 seconds exponential backoff
    },
    removeOnComplete: true,
    removeOnFail: false, // Keep failed jobs in redis queue for visibility or BullMQ dashboard
  },
});

/**
 * Enqueue a new jobs sync job.
 */
export const enqueueJobSync = async (userId: string, syncId: string) => {
  return await jobSyncQueue.add('sync-jobs', { userId, syncId });
};

/**
 * Re-queue a failed job using its original job name and payload.
 */
export const enqueueFailedJobReplay = async (jobType: string, payload: any) => {
  return await jobSyncQueue.add(jobType, payload);
};

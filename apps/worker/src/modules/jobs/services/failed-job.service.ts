import { prisma } from '../../../shared/db/prisma';

export class FailedJobService {
  /**
   * Log details of a permanently failed BullMQ job execution.
   */
  public async log(
    jobType: string,
    payload: any,
    errorMessage: string,
    stackTrace?: string
  ): Promise<void> {
    try {
      await prisma.failedJob.create({
        data: {
          jobType: jobType || 'sync-jobs',
          payload: payload || {},
          errorMessage,
          stackTrace: stackTrace || null,
        },
      });
    } catch (err: any) {
      console.error('[FailedJobService] Error logging failed job to DB:', err.message);
    }
  }
}

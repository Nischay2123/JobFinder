import { SyncStatus } from '@prisma/client';
import { prisma } from '../../../shared/db/prisma';

export class SyncService {
  /**
   * Transition state to FETCHING.
   */
  public async fetching(syncId: string): Promise<void> {
    await prisma.userSync.update({
      where: { id: syncId },
      data: { status: SyncStatus.FETCHING },
    });
  }

  /**
   * Transition state to NORMALIZING.
   */
  public async normalizing(syncId: string): Promise<void> {
    await prisma.userSync.update({
      where: { id: syncId },
      data: { status: SyncStatus.NORMALIZING },
    });
  }

  /**
   * Transition state to COMPLETED with metrics.
   */
  public async completed(syncId: string, jobsFound: number, jobsAdded: number): Promise<void> {
    await prisma.userSync.update({
      where: { id: syncId },
      data: {
        status: SyncStatus.COMPLETED,
        jobsFound,
        jobsAdded,
        completedAt: new Date(),
      },
    });
  }

  /**
   * Transition state to FAILED with message.
   */
  public async fail(syncId: string, errorMessage: string): Promise<void> {
    await prisma.userSync.update({
      where: { id: syncId },
      data: {
        status: SyncStatus.FAILED,
        errorMessage,
        completedAt: new Date(),
      },
    });
  }
}

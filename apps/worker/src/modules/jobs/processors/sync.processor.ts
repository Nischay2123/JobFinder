import { JobSource } from '@prisma/client';
import { ConnectorRegistry } from '../registry/connector.registry';
import { SyncService } from '../services/sync.service';
import { JobStorageService } from '../services/job-storage.service';

export class SyncProcessor {
  private syncService = new SyncService();
  private jobStorageService = new JobStorageService();

  /**
   * Orchestrates the background jobs sync process.
   */
  public async process(
    syncId: string,
    source: JobSource
  ): Promise<{ jobsFound: number; jobsAdded: number }> {
    console.log(`[SyncProcessor] Initiating process for source: ${source}, syncId: ${syncId}`);

    // 1. Move UserSync state to FETCHING
    await this.syncService.fetching(syncId);

    // 2. Resolve the scraper connector from the registry
    const connector = ConnectorRegistry.get(source);

    // 3. Fetch jobs from the resolved source
    const rawJobs = await connector.fetchJobs();

    // 4. Move UserSync state to NORMALIZING
    await this.syncService.normalizing(syncId);

    // 5. Store and deduplicate jobs
    const result = await this.jobStorageService.store(rawJobs);

    // 6. Move UserSync state to COMPLETED with metrics
    await this.syncService.completed(syncId, result.jobsFound, result.jobsAdded);

    return result;
  }
}

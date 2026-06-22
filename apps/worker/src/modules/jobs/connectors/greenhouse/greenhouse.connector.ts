import { RawJob, JobConnector, ConnectorResult } from '../../types/raw-job';
import { GreenhouseClient } from './greenhouse.client';
import { GreenhouseParser } from './greenhouse.parser';
import { createLogger } from '@job-finder/logger';

const logger = createLogger('GreenhouseConnector');

export class GreenhouseConnector implements JobConnector {
  private client = new GreenhouseClient();
  private boards = [
    { token: 'stripe', name: 'Stripe' },
    { token: 'figma', name: 'Figma' },
    { token: 'vercel', name: 'Vercel' },
    { token: 'hashicorp', name: 'HashiCorp' },
    { token: 'cloudflare', name: 'Cloudflare' },
  ];

  /**
   * Fetches jobs from all configured Greenhouse boards.
   */
  public async fetchJobs(): Promise<ConnectorResult> {
    logger.info('[GreenhouseConnector] Starting job fetch...');
    const allJobs: RawJob[] = [];
    let successCount = 0;
    let failCount = 0;

    for (const board of this.boards) {
      try {
        logger.debug(`[GreenhouseConnector] Fetching jobs for board: ${board.name} (${board.token})`);
        const response = await this.client.fetchJobs(board.token);
        const parsedJobs = GreenhouseParser.parseBatch(response.jobs || [], board.name);
        allJobs.push(...parsedJobs);
        successCount++;
        logger.debug(`[GreenhouseConnector] Successfully fetched ${parsedJobs.length} jobs for ${board.name}`);
      } catch (error: any) {
        failCount++;
        logger.warn(`[GreenhouseConnector] Failed to fetch jobs for board ${board.name}: ${error.message}`);
      }
    }

    logger.info(
      `[GreenhouseConnector] Fetch completed. Boards successful: ${successCount}, failed: ${failCount}. Total jobs: ${allJobs.length}`
    );

    if (successCount === 0 && this.boards.length > 0) {
      throw new Error('[GreenhouseConnector] Failed to fetch jobs from all configured Greenhouse boards.');
    }

    return { jobs: allJobs, errorsCount: failCount };
  }
}

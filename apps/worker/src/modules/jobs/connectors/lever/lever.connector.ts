import { RawJob, JobConnector, ConnectorResult } from '../../types/raw-job';
import { LeverClient } from './lever.client';
import { LeverParser } from './lever.parser';
import { createLogger } from '@job-finder/logger';

const logger = createLogger('LeverConnector');

export class LeverConnector implements JobConnector {
  private client = new LeverClient();
  private companies = [
    { token: 'sentry', name: 'Sentry' },
    { token: 'mattermost', name: 'Mattermost' },
    { token: 'palantir', name: 'Palantir' },
    { token: 'fivetran', name: 'Fivetran' },
    { token: 'leverdemo', name: 'Lever Demo' },
  ];

  /**
   * Fetches jobs from all configured Lever companies.
   */
  public async fetchJobs(): Promise<ConnectorResult> {
    logger.info('[LeverConnector] Starting job fetch...');
    const allJobs: RawJob[] = [];
    let successCount = 0;
    let failCount = 0;

    for (const company of this.companies) {
      try {
        logger.debug(`[LeverConnector] Fetching postings for company: ${company.name} (${company.token})`);
        const postings = await this.client.fetchPostings(company.token);
        const parsedJobs = LeverParser.parseBatch(postings, company.name);
        allJobs.push(...parsedJobs);
        successCount++;
        logger.debug(`[LeverConnector] Successfully fetched ${parsedJobs.length} jobs for ${company.name}`);
      } catch (error: any) {
        failCount++;
        logger.warn(`[LeverConnector] Failed to fetch jobs for company ${company.name}: ${error.message}`);
      }
    }

    logger.info(
      `[LeverConnector] Fetch completed. Companies successful: ${successCount}, failed: ${failCount}. Total jobs: ${allJobs.length}`
    );

    if (successCount === 0 && this.companies.length > 0) {
      throw new Error('[LeverConnector] Failed to fetch jobs from all configured Lever boards.');
    }

    return { jobs: allJobs, errorsCount: failCount };
  }
}

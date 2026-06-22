import axios from 'axios';
import { createLogger } from '@job-finder/logger';
import { GreenhouseJobResponse } from './greenhouse.types';

const logger = createLogger('GreenhouseConnector');

export class GreenhouseClient {
  /**
   * Fetches job postings from Greenhouse Job Board API with exponential backoff retries.
   */
  public async fetchJobs(boardToken: string): Promise<GreenhouseJobResponse> {
    const url = `https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs?content=true`;
    let attempts = 0;
    const maxAttempts = 3;
    let delay = 1000;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        logger.debug(`[GreenhouseClient] Fetching jobs for board: ${boardToken} (Attempt ${attempts}/${maxAttempts})`);
        const response = await axios.get<GreenhouseJobResponse>(url, {
          timeout: 10000,
        });
        return response.data;
      } catch (error: any) {
        logger.warn(`[GreenhouseClient] Attempt ${attempts} failed for board ${boardToken}: ${error.message}`);
        if (attempts >= maxAttempts) {
          logger.error(`[GreenhouseClient] Failed to fetch jobs for board ${boardToken} after ${maxAttempts} attempts. Error:`, error);
          throw new Error(`[GreenhouseConnector] Failed to fetch jobs from board ${boardToken}: ${error.message}`);
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
    throw new Error(`[GreenhouseConnector] Failed to fetch jobs from board ${boardToken}`);
  }
}

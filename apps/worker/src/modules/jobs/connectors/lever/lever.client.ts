import axios from 'axios';
import { createLogger } from '@job-finder/logger';
import { LeverPostingResponse } from './lever.types';

const logger = createLogger('LeverConnector');

export class LeverClient {
  /**
   * Fetches job postings from Lever Postings API with exponential backoff retries.
   */
  public async fetchPostings(companyToken: string): Promise<LeverPostingResponse> {
    const url = `https://api.lever.co/v0/postings/${companyToken}?mode=json`;
    let attempts = 0;
    const maxAttempts = 3;
    let delay = 1000;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        logger.debug(`[LeverClient] Fetching postings for company: ${companyToken} (Attempt ${attempts}/${maxAttempts})`);
        const response = await axios.get<LeverPostingResponse>(url, {
          timeout: 10000,
        });

        if (!Array.isArray(response.data)) {
          throw new Error('Invalid response format: expected an array of postings');
        }

        return response.data;
      } catch (error: any) {
        logger.warn(`[LeverClient] Attempt ${attempts} failed for company ${companyToken}: ${error.message}`);
        if (attempts >= maxAttempts) {
          logger.error(`[LeverClient] Failed to fetch postings for company ${companyToken} after ${maxAttempts} attempts. Error:`, error);
          throw new Error(`[LeverConnector] Failed to fetch jobs from company ${companyToken}: ${error.message}`);
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
    throw new Error(`[LeverConnector] Failed to fetch jobs from company ${companyToken}`);
  }
}

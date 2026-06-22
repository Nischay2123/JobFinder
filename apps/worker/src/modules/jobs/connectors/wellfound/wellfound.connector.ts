import { JobConnector, ConnectorResult } from '../../types/raw-job';
import { WellfoundGraphQLStrategy } from './strategies/graphql.strategy';
import { WellfoundHTMLStrategy } from './strategies/html.strategy';
import { WellfoundPlaywrightStrategy } from './strategies/playwright.strategy';
import { WellfoundStrategyHealthStore } from './strategy-health.store';
import { createLogger } from '@job-finder/logger';

const logger = createLogger('WellfoundConnector');

export class WellfoundConnector implements JobConnector {
  private strategies = [
    new WellfoundGraphQLStrategy(),
    new WellfoundHTMLStrategy(),
    new WellfoundPlaywrightStrategy(),
  ];

  /**
   * Fetches jobs from Wellfound by running through configured strategies sequentially.
   */
  public async fetchJobs(): Promise<ConnectorResult> {
    logger.info('[WellfoundConnector] Starting job fetch...');
    const errors: string[] = [];

    for (const strategy of this.strategies) {
      const name = strategy.name;

      // Check failure policy
      const skip = await WellfoundStrategyHealthStore.shouldSkip(name);
      if (skip) {
        logger.info(`[WellfoundConnector] Skipping strategy ${name} due to failure policy.`);
        continue;
      }

      try {
        logger.debug(`[WellfoundConnector] Attempting fetch with strategy: ${name}`);
        const parsedJobs = await strategy.fetchJobs();
        logger.info(`[WellfoundConnector] Successfully fetched ${parsedJobs.length} jobs using ${name}`);

        // Record success
        await WellfoundStrategyHealthStore.recordSuccess(name);

        return {
          jobs: parsedJobs,
          errorsCount: errors.length,
        };
      } catch (error: any) {
        logger.warn(`[WellfoundConnector] Strategy ${name} failed: ${error.message}`);
        errors.push(`${name}: ${error.message}`);

        // Record failure
        await WellfoundStrategyHealthStore.recordFailure(name);
      }
    }

    const aggregatedError = `WellfoundConnector failed to retrieve jobs. Strategies tried:\n${errors.join('\n')}`;
    logger.error(`[WellfoundConnector] ${aggregatedError}`);
    throw new Error(aggregatedError);
  }
}

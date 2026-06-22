import { RawJob } from '../../../types/raw-job';
import { WellfoundStrategy } from './wellfound-strategy.interface';
import { createLogger } from '@job-finder/logger';

const logger = createLogger('WellfoundPlaywrightStrategy');

export class WellfoundPlaywrightStrategy implements WellfoundStrategy {
  public readonly name = 'PlaywrightStrategy';

  public async fetchJobs(): Promise<RawJob[]> {
    logger.warn('[WellfoundPlaywrightStrategy] Playwright strategy is currently disabled (stub implementation).');
    return [];
  }
}

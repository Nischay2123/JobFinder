import { RedisManager } from '../../../../shared/redis/redis.manager';

interface HealthState {
  failures: number;
  lastSuccess?: string;
  lastFailure?: string;
}

export class WellfoundStrategyHealthStore {
  private static getRedis() {
    return RedisManager.getConnection('cache');
  }

  private static getKey(strategyName: string): string {
    return `strategy:wellfound:${strategyName.toLowerCase()}`;
  }

  public static async getHealth(strategyName: string): Promise<HealthState> {
    const redis = this.getRedis();
    const data = await redis.get(this.getKey(strategyName));
    if (!data) {
      return { failures: 0 };
    }
    try {
      return JSON.parse(data);
    } catch {
      return { failures: 0 };
    }
  }

  public static async recordSuccess(strategyName: string): Promise<void> {
    const redis = this.getRedis();
    const health = await this.getHealth(strategyName);
    health.failures = 0;
    health.lastSuccess = new Date().toISOString();
    await redis.set(this.getKey(strategyName), JSON.stringify(health));
  }

  public static async recordFailure(strategyName: string): Promise<void> {
    const redis = this.getRedis();
    const health = await this.getHealth(strategyName);
    health.failures = (health.failures || 0) + 1;
    health.lastFailure = new Date().toISOString();
    await redis.set(this.getKey(strategyName), JSON.stringify(health));
  }

  public static async shouldSkip(strategyName: string): Promise<boolean> {
    const health = await this.getHealth(strategyName);

    if (health.failures >= 5) {
      // Weekly reset: 7 days in milliseconds
      const weekMs = 7 * 24 * 60 * 60 * 1000;
      if (health.lastFailure && Date.now() - new Date(health.lastFailure).getTime() > weekMs) {
        // Reset failures since a week has passed
        await this.recordReset(strategyName);
        return false;
      }
      return true;
    }

    return false;
  }

  private static async recordReset(strategyName: string): Promise<void> {
    const redis = this.getRedis();
    const health = await this.getHealth(strategyName);
    health.failures = 0;
    await redis.set(this.getKey(strategyName), JSON.stringify(health));
  }
}

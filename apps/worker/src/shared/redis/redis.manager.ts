import { Redis } from 'ioredis';
import { config } from '../../config';

export class RedisManager {
  private static instances: Map<string, Redis> = new Map();

  /**
   * Get a cached or new Redis instance by connection type.
   * Sets maxRetriesPerRequest to null for BullMQ compatibility.
   */
  public static getConnection(type: 'queue' | 'cache' | 'pubsub' = 'queue'): Redis {
    if (this.instances.has(type)) {
      return this.instances.get(type)!;
    }

    const connectionUrl = config.REDIS_URL;
    const options: any = {};
    
    if (type === 'queue') {
      options.maxRetriesPerRequest = null;
    }

    const redis = new Redis(connectionUrl, options);

    redis.on('error', (err) => {
      console.error(`[RedisManager] Redis connection error on type [${type}]:`, err);
    });

    redis.on('connect', () => {
      console.log(`[RedisManager] Redis connected successfully for [${type}]`);
    });

    this.instances.set(type, redis);
    return redis;
  }

  /**
   * Close all active Redis connections.
   */
  public static async closeAll(): Promise<void> {
    for (const [type, redis] of this.instances.entries()) {
      await redis.quit();
      this.instances.delete(type);
    }
    console.log('[RedisManager] All Redis connections closed.');
  }
}

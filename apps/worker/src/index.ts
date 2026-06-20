import { config } from './config';
import { jobsWorker } from './modules/jobs/jobs.worker';
import { RedisManager } from './shared/redis/redis.manager';
import { prisma } from './shared/db/prisma';

console.log(`[Worker Process] Starting worker in [${config.NODE_ENV}] mode...`);

// Handle graceful shutdown signals
const gracefulShutdown = async (signal: string) => {
  console.log(`[Worker Process] Received ${signal}. Initializing graceful shutdown...`);

  // 1. Close the BullMQ Worker to stop accepting new jobs
  try {
    await jobsWorker.close();
    console.log('[Worker Process] BullMQ Worker interface closed.');
  } catch (err: any) {
    console.error('[Worker Process] Error closing BullMQ Worker:', err.message);
  }

  // 2. Shut down Redis connection instances
  try {
    await RedisManager.closeAll();
  } catch (err: any) {
    console.error('[Worker Process] Error closing Redis connections:', err.message);
  }

  // 3. Disconnect PostgreSQL database client
  try {
    await prisma.$disconnect();
    console.log('[Worker Process] PostgreSQL DB connection disconnected.');
  } catch (err: any) {
    console.error('[Worker Process] Error disconnecting DB:', err.message);
  }

  console.log('[Worker Process] Clean exit complete.');
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

console.log('[Worker Process] Decoupled background worker successfully started and listening for jobs.');

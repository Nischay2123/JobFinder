import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

// Try to load env from apps/api/.env as a fallback for local developer ergonomics
dotenv.config({ path: path.resolve(process.cwd(), '../api/.env') });
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Worker: Invalid environment variables:', _env.error.format());
  throw new Error('Worker: Invalid environment variables');
}

export const config = _env.data;
export type Config = typeof config;

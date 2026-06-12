import { Request, Response, NextFunction } from 'express';
import { createLogger } from '@job-finder/logger';

const logger = createLogger('api');

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;

    logger.info(
      {
        method,
        url: originalUrl,
        status: statusCode,
        durationMs: duration,
      },
      `${method} ${originalUrl} -> ${statusCode} (${duration}ms)`
    );
  });

  next();
};

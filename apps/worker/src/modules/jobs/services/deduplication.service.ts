import crypto from 'crypto';
import { prisma } from '../../../shared/db/prisma';

export class DeduplicationService {
  /**
   * Computes sha256 job hash based on source, sourceJobId, company name, title, and location.
   */
  public generateHash(
    source: string,
    sourceJobId: string,
    company: string,
    title: string,
    location: string
  ): string {
    const data = `${source}:${sourceJobId}:${company}:${title}:${location}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Checks if a job with this unique hash is already stored in PostgreSQL.
   */
  public async exists(hash: string): Promise<boolean> {
    const job = await prisma.job.findUnique({
      where: { jobHash: hash },
    });
    return !!job;
  }
}

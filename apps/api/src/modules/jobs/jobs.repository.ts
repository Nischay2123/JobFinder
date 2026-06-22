import { prisma } from '../../shared/db/prisma';

export class JobRepository {
  /**
   * Retrieves active jobs ordered by discoveredAt (newest first).
   * Enforces status = 'ACTIVE' filtering.
   */
  public static async findActiveJobs(options: { take?: number; skip?: number } = {}) {
    return await prisma.job.findMany({
      where: {
        status: 'ACTIVE',
      },
      include: {
        company: true,
      },
      orderBy: {
        discoveredAt: 'desc',
      },
      take: options.take ?? 50,
      skip: options.skip,
    });
  }

  /**
   * Retrieves a single active job by ID.
   * Enforces status = 'ACTIVE' filtering.
   */
  public static async findActiveJobById(id: string) {
    return await prisma.job.findFirst({
      where: {
        id,
        status: 'ACTIVE',
      },
      include: {
        company: true,
      },
    });
  }
}

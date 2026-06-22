import { prisma } from '../../../shared/db/prisma';
import { RawJob } from '../types/raw-job';
import { NormalizedJob } from '../types/normalized-job';
import { JobNormalizer } from '../normalizers/job.normalizer';
import { DeduplicationService } from './deduplication.service';

export class JobStorageService {
  private deduplicationService = new DeduplicationService();

  /**
   * Helper to resolve or insert a Company record transactionally.
   */
  private async findOrCreateCompany(name: string, website: string | null, tx: any) {
    let company = await tx.company.findUnique({
      where: { name },
    });

    if (!company) {
      company = await tx.company.create({
        data: {
          name,
          website,
        },
      });
    }

    return company;
  }

  /**
   * Helper to insert a Job record transactionally.
   */
  private async createJob(normalized: NormalizedJob, hash: string, companyId: string, tx: any) {
    return await tx.job.create({
      data: {
        companyId,
        source: normalized.source,
        sourceJobId: normalized.sourceJobId,
        title: normalized.title,
        description: normalized.description,
        location: normalized.location,
        remoteType: normalized.remoteType,
        applyUrl: normalized.applyUrl,
        experienceRequired: normalized.experienceRequired,
        employmentType: normalized.employmentType,
        salary: normalized.salary,
        postedDate: normalized.postedDate,
        jobHash: hash,
        rawPayload: normalized.rawPayload as any,
        firstSeenAt: new Date(),
        lastSeenAt: new Date(),
        status: 'ACTIVE',
      },
    });
  }

  /**
   * Normalizes, deduplicates, and saves job batches into the PostgreSQL database.
   */
  public async store(rawJobs: RawJob[]): Promise<{ jobsFound: number; jobsAdded: number; jobsUpdated: number }> {
    const jobsFound = rawJobs.length;
    let jobsAdded = 0;
    let jobsUpdated = 0;

    for (const rawJob of rawJobs) {
      try {
        const normalized = JobNormalizer.normalize(rawJob);

        const hash = this.deduplicationService.generateHash(
          normalized.source,
          normalized.sourceJobId || '',
          normalized.companyName,
          normalized.title,
          normalized.location || ''
        );

        const existingJob = await prisma.job.findUnique({
          where: { jobHash: hash },
        });

        if (existingJob) {
          await prisma.job.update({
            where: { id: existingJob.id },
            data: {
              lastSeenAt: new Date(),
              status: 'ACTIVE',
              deletedAt: null,
            },
          });
          jobsUpdated++;
          continue;
        }

        await prisma.$transaction(async (tx) => {
          const company = await this.findOrCreateCompany(
            normalized.companyName,
            normalized.companyWebsite,
            tx
          );

          await this.createJob(normalized, hash, company.id, tx);
        });

        jobsAdded++;
      } catch (err: any) {
        console.error(
          `[JobStorageService] Error storing job "${rawJob.title}" for company "${rawJob.company}":`,
          err.message
        );
      }
    }

    return { jobsFound, jobsAdded, jobsUpdated };
  }
}

import { RawJob } from '../../types/raw-job';
import { GreenhouseJob } from './greenhouse.types';

export class GreenhouseParser {
  /**
   * Transforms a single GreenhouseJob DTO into a standard RawJob format.
   */
  public static parse(job: GreenhouseJob, companyName: string): RawJob {
    return {
      source: 'GREENHOUSE',
      sourceJobId: String(job.id),
      title: job.title,
      company: companyName,
      description: job.content || 'Refer to application link for details.',
      location: job.location?.name || '',
      applyUrl: job.absolute_url,
      postedDate: job.updated_at ? new Date(job.updated_at) : new Date(),
      rawPayload: job,
    };
  }

  /**
   * Batch transforms multiple GreenhouseJobs.
   */
  public static parseBatch(jobs: GreenhouseJob[], companyName: string): RawJob[] {
    return jobs.map((job) => this.parse(job, companyName));
  }
}

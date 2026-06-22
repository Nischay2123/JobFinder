import { RawJob } from '../../types/raw-job';
import { WellfoundGraphQLResponse, WellfoundJob } from './wellfound.types';

export class WellfoundParser {
  /**
   * Transforms Wellfound GraphQL query response data into standard RawJob format.
   */
  public static parseGraphQL(response: WellfoundGraphQLResponse): RawJob[] {
    const jobs = response.data?.jobSearchResults?.jobs || [];
    return jobs.map((job) => this.parseJob(job));
  }

  /**
   * Transforms a single WellfoundJob DTO into a standard RawJob format.
   */
  private static parseJob(job: WellfoundJob): RawJob {
    return {
      source: 'WELLFOUND',
      sourceJobId: job.id,
      title: job.title,
      company: job.company?.name || 'Wellfound Company',
      companyWebsite: job.company?.website || undefined,
      description: job.description || 'Refer to application link for details.',
      location: job.location || '',
      applyUrl: job.applyUrl,
      postedDate: job.postedAt ? new Date(job.postedAt) : new Date(),
      rawPayload: job,
    };
  }
}

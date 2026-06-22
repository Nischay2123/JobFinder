import { RawJob } from '../../types/raw-job';
import { LeverPosting } from './lever.types';

export class LeverParser {
  /**
   * Transforms a single LeverPosting DTO into a standard RawJob format.
   */
  public static parse(posting: LeverPosting, companyName: string): RawJob {
    const description = posting.description || posting.descriptionPlain || 'Refer to application link for details.';

    return {
      source: 'LEVER',
      sourceJobId: posting.id,
      title: posting.text || posting.title || '',
      company: companyName,
      description,
      location: posting.categories?.location || '',
      applyUrl: posting.applyUrl || posting.hostedUrl,
      postedDate: posting.createdAt ? new Date(posting.createdAt) : new Date(),
      employmentType: posting.categories?.commitment || undefined,
      rawPayload: posting,
    };
  }

  /**
   * Batch transforms multiple LeverPostings.
   */
  public static parseBatch(postings: LeverPosting[], companyName: string): RawJob[] {
    return postings.map((posting) => this.parse(posting, companyName));
  }
}

import { JobSource, RemoteType, EmploymentType } from '@prisma/client';
import { RawJob } from '../types/raw-job';
import { NormalizedJob } from '../types/normalized-job';

export class JobNormalizer {
  /**
   * Maps RawJob fields to database structures and Prisma enum types.
   */
  public static normalize(rawJob: RawJob): NormalizedJob {
    const companyNameNormalized = rawJob.company.trim();
    const jobTitleNormalized = rawJob.title.trim();
    const locationNormalized = rawJob.location?.trim() || '';

    // Classify Remote Type
    let remoteType: RemoteType = RemoteType.UNKNOWN;
    const locLower = locationNormalized.toLowerCase();
    if (locLower.includes('remote') || locLower.includes('anywhere')) {
      remoteType = RemoteType.REMOTE;
    } else if (locLower.includes('hybrid')) {
      remoteType = RemoteType.HYBRID;
    } else if (locLower) {
      remoteType = RemoteType.ONSITE;
    }

    // Classify Employment Type
    let employmentType: EmploymentType | null = null;
    if (rawJob.employmentType) {
      const typeStr = rawJob.employmentType.toUpperCase().replace('-', '_');
      if (['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'].includes(typeStr)) {
        employmentType = typeStr as EmploymentType;
      }
    }

    // Map source string to JobSource enum
    let source: JobSource = JobSource.YC;
    if (rawJob.source && rawJob.source.toUpperCase() in JobSource) {
      source = rawJob.source.toUpperCase() as JobSource;
    }

    return {
      source,
      sourceJobId: rawJob.sourceJobId || null,
      title: jobTitleNormalized,
      companyName: companyNameNormalized,
      companyWebsite: rawJob.companyWebsite || null,
      description: rawJob.description,
      location: locationNormalized || null,
      remoteType,
      applyUrl: rawJob.applyUrl,
      experienceRequired: rawJob.experienceRequired || null,
      employmentType,
      salary: rawJob.salary || null,
      postedDate: rawJob.postedDate || null,
      rawPayload: rawJob.rawPayload,
    };
  }
}

import { JobSource, RemoteType, EmploymentType } from '@prisma/client';

export interface NormalizedJob {
  source: JobSource;
  sourceJobId: string | null;
  title: string;
  companyName: string;
  companyWebsite: string | null;
  description: string;
  location: string | null;
  remoteType: RemoteType;
  applyUrl: string;
  experienceRequired: string | null;
  employmentType: EmploymentType | null;
  salary: string | null;
  postedDate: Date | null;
  rawPayload: any;
}

export interface RawJob {
  source: string;
  sourceJobId?: string;
  title: string;
  company: string;
  companyWebsite?: string;
  description: string;
  location?: string;
  applyUrl: string;
  postedDate?: Date;
  employmentType?: string;
  experienceRequired?: string | null;
  salary?: string;
  rawPayload: unknown;
}

export interface ConnectorResult {
  jobs: RawJob[];
  errorsCount: number;
}

export interface JobConnector {
  fetchJobs(): Promise<ConnectorResult>;
}

import { RawJob } from '../../../types/raw-job';

export interface WellfoundStrategy {
  readonly name: string;
  fetchJobs(): Promise<RawJob[]>;
}

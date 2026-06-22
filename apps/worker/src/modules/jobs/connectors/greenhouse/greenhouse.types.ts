export interface GreenhouseLocation {
  name: string;
}

export interface GreenhouseJob {
  id: number;
  internal_job_id: number;
  title: string;
  location: GreenhouseLocation;
  absolute_url: string;
  updated_at: string;
  content: string; // The HTML description
}

export interface GreenhouseJobResponse {
  jobs: GreenhouseJob[];
}

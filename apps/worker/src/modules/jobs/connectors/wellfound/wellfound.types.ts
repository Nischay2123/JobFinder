export interface WellfoundCompany {
  name: string;
  website?: string;
}

export interface WellfoundJob {
  id: string;
  title: string;
  description: string;
  applyUrl: string;
  location?: string;
  company: WellfoundCompany;
  postedAt?: string; // ISO date string
}

export interface WellfoundGraphQLResponse {
  data?: {
    jobSearchResults?: {
      jobs?: WellfoundJob[];
    };
  };
  errors?: { message: string }[];
}

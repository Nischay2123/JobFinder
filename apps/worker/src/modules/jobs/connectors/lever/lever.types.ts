export interface LeverCategories {
  team?: string;
  department?: string;
  location?: string;
  commitment?: string;
}

export interface LeverPosting {
  id: string;
  title?: string;
  text: string;
  categories: LeverCategories;
  description: string;
  descriptionPlain: string;
  hostedUrl: string;
  applyUrl: string;
  createdAt: number; // Timestamp in milliseconds
}

export type LeverPostingResponse = LeverPosting[];

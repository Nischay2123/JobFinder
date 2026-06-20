export interface HnItemPayload {
  by: string;
  id: number;
  score?: number;
  time: number;
  title: string;
  type: string;
  url?: string;
  text?: string;
}

export interface CheerioJobPayload {
  id: string;
  titleText: string;
  applyUrl: string;
  ageTitle: string;
}

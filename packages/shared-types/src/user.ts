export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  STUDENT = 'STUDENT',
  FRESHER = 'FRESHER',
  WORKING_PROFESSIONAL = 'WORKING_PROFESSIONAL',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: Date;
  profile?: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  city: string;
  state: string;
  country: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  currentStatus?: UserStatus;
  experienceYears?: number;
  preferredRoles: string[];
  preferredLocations: Location[];
  skills: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  isCompleted: boolean;
  experiences?: Experience[];
  projects?: Project[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Experience {
  id: string;
  profileId: string;
  companyName: string;
  role: string;
  employmentType?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  profileId: string;
  title: string;
  description?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

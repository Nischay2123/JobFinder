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

export interface UserProfile {
  id: string;
  userId: string;
  currentStatus?: UserStatus;
  experienceYears?: number;
  preferredRoles: string[];
  preferredLocations: string[];
  resumeUrl?: string;
}

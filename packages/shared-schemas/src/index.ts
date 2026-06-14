import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const startRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export const completeRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: passwordSchema,
  currentStatus: z.enum(['STUDENT', 'FRESHER', 'WORKING_PROFESSIONAL']),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
});

export const jobSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  location: z.string(),
});

export const profileStep1Schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(6, 'Valid phone number is required'),
  currentStatus: z.enum(['STUDENT', 'FRESHER', 'WORKING_PROFESSIONAL']),
});

export const experienceSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role is required'),
  employmentType: z.string().optional().nullable(),
  startDate: z.string().or(z.date()).transform((val) => new Date(val)),
  endDate: z.string().or(z.date()).optional().nullable().transform((val) => val ? new Date(val) : null),
  isCurrent: z.boolean().default(false),
  description: z.string().optional().nullable(),
});

export const projectSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().optional().nullable(),
  technologies: z.array(z.string()).default([]),
  githubUrl: z.string().url().or(z.string().length(0)).optional().nullable(),
  liveUrl: z.string().url().or(z.string().length(0)).optional().nullable(),
});

export const locationSchema = z.object({
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
});

export const saveOnboardingSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(6, 'Valid phone number is required'),
  currentStatus: z.enum(['STUDENT', 'FRESHER', 'WORKING_PROFESSIONAL']),
  experienceYears: z.number().optional().nullable(),
  preferredRoles: z.array(z.string()).min(1, 'At least one preferred role is required'),
  preferredLocations: z.array(locationSchema).default([]),
  skills: z.array(z.string()).default([]),
  linkedinUrl: z.string().url().or(z.string().length(0)).optional().nullable(),
  githubUrl: z.string().url().or(z.string().length(0)).optional().nullable(),
  portfolioUrl: z.string().url().or(z.string().length(0)).optional().nullable(),
  resumeUrl: z.string().url().or(z.string().length(0)).optional().nullable(),
  experiences: z.array(experienceSchema).default([]),
  projects: z.array(projectSchema).default([]),
});


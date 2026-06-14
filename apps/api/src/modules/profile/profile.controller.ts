import { Request, Response, NextFunction } from 'express';
import { ProfileService } from './profile.service';
import { saveOnboardingSchema } from '@job-finder/shared-schemas';
import { AppError } from '../../shared/utils/AppError';

const profileService = new ProfileService();

export const uploadResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    if (!file) {
      throw new AppError('No file uploaded or invalid field name. Upload your PDF file using the "resume" field.', 400);
    }

    if (file.mimetype !== 'application/pdf') {
      throw new AppError('Only PDF files are supported for resume uploading.', 400);
    }

    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError('Unauthorized access', 401);
    }

    // 1. Extract text from PDF buffer
    const extractedText = await profileService.extractTextFromPdf(file.buffer);

    // 2. Parse text to structured JSON via Gemini
    const extractedData = await profileService.parseResumeWithAI(extractedText);

    // 3. Upload raw PDF to AWS S3
    const resumeUrl = await profileService.uploadResumeToS3(userId, file.buffer, file.originalname);

    res.status(200).json({
      message: 'Resume parsed and uploaded successfully',
      resumeUrl,
      extractedData,
    });
  } catch (error) {
    next(error);
  }
};

export const saveOnboarding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError('Unauthorized access', 401);
    }

    const validatedData = saveOnboardingSchema.parse(req.body);
    const updatedProfile = await profileService.saveOnboarding(userId, validatedData);

    res.status(200).json({
      message: 'Onboarding completed and profile saved successfully',
      profile: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError('Unauthorized access', 401);
    }

    const profile = await profileService.getProfileByUserId(userId);
    res.status(200).json({ profile });
  } catch (error) {
    next(error);
  }
};

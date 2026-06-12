import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import {
  startRegistrationSchema,
  verifyEmailSchema,
  completeRegistrationSchema,
  loginSchema,
} from '@job-finder/shared-schemas';
import { config } from '../../config';
import { getLogger } from 'nodemailer/lib/shared';

const logger = getLogger();
const authService = new AuthService();

const ACCESS_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 15 * 60 * 1000, // 15 minutes in ms
};

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
};

export const startRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = startRegistrationSchema.parse(req.body);
    logger.info(`Starting registration for email: ${email}`);
    const result = await authService.startRegistration(email);
    res.status(200).json({
      ...result, // Including token for development/testing
    });
  } catch (error) {
    logger.error('Error starting registration:', error);
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = verifyEmailSchema.parse(req.body);
    const result = await authService.verifyEmail(token);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const completeRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const registrationToken = req.headers['x-registration-token'] as string;
    const data = completeRegistrationSchema.parse(req.body);
    const { user, accessToken, refreshToken } = await authService.completeRegistration(
      registrationToken,
      data
    );

    res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    res.cookie('accessToken', accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const { user, accessToken, refreshToken } = await authService.login(email, password);

    res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    res.cookie('accessToken', accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (userId) {
      await authService.logout(userId);
    }
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    res.status(200).json({ message: 'Logged out' });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { user, accessToken, refreshToken: newRefreshToken } = await authService.refresh(
      refreshToken
    );

    res.cookie('refreshToken', newRefreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    res.cookie('accessToken', accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { config } from '../../config';
import { prisma } from '../db/prisma';

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  let token = req.cookies.accessToken;

  // Fallback to Authorization header if cookie is not present
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return next(new AppError('No token provided', 401));
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as any;
    
    // Fetch user from DB to verify existence and get latest details
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      include: { profile: true },
    });

    if (!user || !user.isActive) {
      return next(new AppError('User not found or inactive', 401));
    }

    (req as any).user = user;
    next();
  } catch (err) {
    next(new AppError('Invalid or expired token', 401));
  }
};

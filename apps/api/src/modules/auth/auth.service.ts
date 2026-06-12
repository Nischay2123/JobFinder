import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../shared/db/prisma';
import { AppError } from '../../shared/utils/AppError';
import { emailService } from '../../shared/utils/email.service';
import { config } from '../../config';

const BCRYPT_COST = 12;
const ACCESS_TOKEN_EXPIRY = '15m';
const REGISTRATION_TOKEN_EXPIRY = '30m';
const VERIFICATION_TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes in ms

export class AuthService {
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async startRegistration(email: string) {
    // 1. Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    // 2. Handle EmailVerification
    const token = this.generateToken();
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY);

    const existingVerification = await prisma.emailVerification.findUnique({
      where: { email },
    });

    if (existingVerification) {
      // Reuse row if it exists and not verified (or even if verified, we restart if they ask again)
      await prisma.emailVerification.update({
        where: { email },
        data: {
          tokenHash,
          expiresAt,
          verifiedAt: null, // Reset verification status
        },
      });
    } else {
      await prisma.emailVerification.create({
        data: {
          email,
          tokenHash,
          expiresAt,
        },
      });
    }

    // 3. Send real email
    await emailService.sendVerificationEmail(email, token);

    return { message: 'Verification email sent' };
  }

  async verifyEmail(token: string) {
    const tokenHash = this.hashToken(token);
    
    const verification = await prisma.emailVerification.findFirst({
      where: {
        tokenHash,
        expiresAt: { gt: new Date() },
      },
    });

    if (!verification) {
      throw new AppError('Invalid or expired verification token', 400);
    }

    await prisma.emailVerification.update({
      where: { id: verification.id },
      data: { verifiedAt: new Date() },
    });

    // Generate registration token (JWT) to be used in completeRegistration
    const registrationToken = jwt.sign(
      { email: verification.email, type: 'registration' },
      config.JWT_SECRET,
      { expiresIn: REGISTRATION_TOKEN_EXPIRY }
    );

    return { registrationToken };
  }

  async completeRegistration(registrationToken: string, data: any) {
    let decoded: any;
    try {
      decoded = jwt.verify(registrationToken, config.JWT_SECRET);
      if (decoded.type !== 'registration') throw new Error();
    } catch (err) {
      throw new AppError('Invalid or expired registration token', 400);
    }

    const { email } = decoded;
    const { name, password, currentStatus } = data;

    // Ensure email was actually verified
    const verification = await prisma.emailVerification.findUnique({
      where: { email },
    });

    if (!verification || !verification.verifiedAt) {
      throw new AppError('Email not verified', 400);
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

    return await prisma.$transaction(async (tx: any) => {
      const user = await tx.user.create({
        data: {
          email,
          name,
          passwordHash,
          profile: {
            create: {
              currentStatus,
            },
          },
        },
        include: { profile: true },
      });

      await tx.emailVerification.delete({ where: { email } });

      return this.issueTokens(user, tx);
    });
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user || !user.isActive) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    return this.issueTokens(user);
  }

  private async issueTokens(user: any, tx: any = prisma) {
    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      config.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = this.generateToken();
    const refreshTokenHash = this.hashToken(refreshToken);

    await tx.user.update({
      where: { id: user.id },
      data: {
        refreshTokenHash,
        lastLoginAt: new Date(),
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: user.profile,
      },
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new AppError('Invalid refresh token', 401);
    }
    const tokenHash = this.hashToken(refreshToken);
    const user = await prisma.user.findFirst({
      where: { refreshTokenHash: tokenHash },
      include: { profile: true },
    });

    if (!user || !user.isActive) {
      throw new AppError('Invalid refresh token', 401);
    }

    return this.issueTokens(user);
  }

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user || !user.isActive) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}

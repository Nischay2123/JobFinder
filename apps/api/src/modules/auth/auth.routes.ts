import { Router } from 'express';
import * as authController from './auth.controller';
import { authenticate } from '../../shared/middleware/auth';

const router = Router();

router.post('/start-registration', authController.startRegistration);
router.post('/verify-email', authController.verifyEmail);
router.post('/complete-registration', authController.completeRegistration);
router.post('/login', authController.login);
router.post('/logout', authenticate, authController.logout);
router.post('/refresh', authController.refresh);
router.get('/me', authenticate, authController.me);

export { router as authRoutes };

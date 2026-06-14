import { Router } from 'express';
import multer from 'multer';
import * as profileController from './profile.controller';
import { authenticate } from '../../shared/middleware/auth';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB file size limit
  },
});

router.post('/upload-resume', authenticate, upload.single('resume'), profileController.uploadResume);
router.put('/save-onboarding', authenticate, profileController.saveOnboarding);
router.get('/me', authenticate, profileController.getMyProfile);

export { router as profileRoutes };

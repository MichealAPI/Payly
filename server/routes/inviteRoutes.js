import express from 'express';
import { acceptInvite } from '../controllers/inviteController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// All invite routes require authentication
router.use(requireAuth);

router.post('/accept', acceptInvite);

export default router;
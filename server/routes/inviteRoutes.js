import express from 'express';
import { acceptInvite, createInvite } from '../controllers/inviteController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.post('/:groupId/create', createInvite);
router.post('/accept', acceptInvite);

export default router;
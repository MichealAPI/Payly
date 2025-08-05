import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { getCurrentUser } from '../controllers/userController.js';
const router = express.Router();

router.use(requireAuth);

// Movement routes
router.get('/current', getCurrentUser);

export default router;
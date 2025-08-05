import express from 'express';
import { loginUser, registerUser, getUserProfile, updateUserSettings, getUserProfilePicture, deleteUserAccount, uploadMiddleware } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);

router.get('/profile', requireAuth, getUserProfile);
router.put('/settings', requireAuth, uploadMiddleware, updateUserSettings);
router.delete('/account', requireAuth, deleteUserAccount);
router.get('/profile-picture/:userId', requireAuth, getUserProfilePicture);


export default router;

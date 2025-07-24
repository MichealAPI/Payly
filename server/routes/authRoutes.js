import express from 'express';
import { loginUser, registerUser } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);

router.get('/profile', requireAuth, (req, res) => {
    res.status(200).json(req.user);
});

export default router;

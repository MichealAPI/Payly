import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { createExpense, updateExpense } from '../controllers/expenseController.js';

const router = express.Router();

router.use(requireAuth);

// Movement routes
router.post('/:groupId', createExpense);
router.put('/:groupId/:expenseId', updateExpense);

export default router;
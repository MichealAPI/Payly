import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  createExpense,
  deleteExpense,
  updateExpense,
} from "../controllers/expenseController.js";

const router = express.Router();

router.use(requireAuth);

router.post("/:groupId/create", createExpense);
router.put("/:groupId/:expenseId/update", updateExpense);
router.delete("/:groupId/:expenseId/delete", deleteExpense);

export default router;

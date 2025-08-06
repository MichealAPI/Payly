import express from "express";
import {
  loginUser,
  registerUser,
  deleteUserAccount,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.delete("/delete", requireAuth, deleteUserAccount);

export default router;

import express from "express";
import {
  createGroup,
  getGroups,
  updateGroup,
  deleteGroup,
  getBalances,
  retrieveGroup,
  kickUserFromGroup,
} from "../controllers/groupController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to all group routes
router.use(requireAuth);

router.get("/list", getGroups);
router.get("/:groupId/balances", getBalances);
router.get("/:groupId/retrieve", retrieveGroup);

router.post("/", createGroup);
router.post("/:groupId/:userId/kick", kickUserFromGroup);

router.put("/:groupId/update", updateGroup);

router.delete("/:groupId/delete", deleteGroup);

export default router;

import express from "express";
import {
  createGroup,
  getGroups,
  updateGroup,
  deleteGroup,
  getBalances,
  archiveGroup,
  getUserArchivedGroups,
  updateGroupOrder,
  getGroupDetails,
  kickUserFromGroup
} from "../controllers/groupController.js";
import { createInvite } from "../controllers/inviteController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to all group routes
router.use(requireAuth);

router.get("/list", getGroups);
router.get("/archived", getUserArchivedGroups);
router.put("/order", updateGroupOrder);
router.post("/", createGroup);
router.put("/:id", updateGroup);
router.get("/:id", getGroupDetails);
router.delete("/:id", deleteGroup);
router.post("/:id/archive", archiveGroup);
router.post("/:id/unarchive", archiveGroup);
router.post("/:id/invites", createInvite); 
router.get("/:id/balances", getBalances);
router.post("/:id/:userId/kick", kickUserFromGroup);

export default router;

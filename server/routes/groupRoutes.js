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
} from "../controllers/groupController.js";
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
router.get("/:id/balances", getBalances);

export default router;

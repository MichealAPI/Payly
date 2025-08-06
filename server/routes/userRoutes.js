import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  getCurrentUser,
  handleArchivingUserGroup,
  getUserArchivedGroups,
  updateUserGroupOrder,
  updateUserSettings,
} from "../controllers/userController.js";

import { uploadMiddleware } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/current", getCurrentUser);

router.post("/:groupId/archive", handleArchivingUserGroup);
router.post("/:groupId/unarchive", handleArchivingUserGroup);

router.get("/:groupId/archived", getUserArchivedGroups);

router.put("/:groupId/order", updateUserGroupOrder);
router.put("/settings/update", requireAuth, uploadMiddleware, updateUserSettings);

export default router;

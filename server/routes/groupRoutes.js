import express from 'express';
import { createGroup, getGroups, updateGroup, deleteGroup, archiveGroup, getUserArchivedGroups } from '../controllers/groupController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all group routes
router.use(requireAuth);

router.post('/', createGroup);
router.get('/list', getGroups);
router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);
router.post('/:id/archive', archiveGroup)
router.post('/:id/unarchive', archiveGroup);
router.get('/archived', getUserArchivedGroups);

export default router;

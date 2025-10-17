import express from 'express';
import { addChannelsToWorkspaceController, addMemberToWorkspaceController, createWorkspaceController, deleteWorkspaceController, getWorkspaceByJoinController, getWorkspaceController, getWorkspacesUserIsMemberOfController, updateWorkspaceController } from '../../controllers/workspace.controller.js';
import { validate } from '../../validators/zodValidator.js';
import { addChannelToWorkspaceSchema, addMemberToWorkspaceSchema, createWorkspaceSchema } from '../../validators/workspaceSchema.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();


router.post('/',isAuthenticated,validate(createWorkspaceSchema),createWorkspaceController);
router.get('/',isAuthenticated,getWorkspacesUserIsMemberOfController);
router.delete('/:workspaceId',isAuthenticated,deleteWorkspaceController);
router.get('/:workspaceId',isAuthenticated,getWorkspaceController);
router.get('/join/:joinCode',isAuthenticated,getWorkspaceByJoinController);
router.put('/:workspaceId',isAuthenticated,updateWorkspaceController);
router.put('/:workspaceId/members',isAuthenticated,validate(addMemberToWorkspaceSchema) ,addMemberToWorkspaceController);

router.put('/:workspaceId/channels',isAuthenticated,validate(addChannelToWorkspaceSchema),addChannelsToWorkspaceController);

export default router;
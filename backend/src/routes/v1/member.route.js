import express from 'express';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';
//import { getChannelByIdController } from '../../controllers/channel.controller.js';
import { isMemberPartOfWorkspaceController } from '../../controllers/member.controller.js';


const router = express.Router();

router.get('/workspace/:workspaceId',isAuthenticated,isMemberPartOfWorkspaceController);

export default router;
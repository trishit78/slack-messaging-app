import express from 'express'; 

import userRouter from './user.route.js'
import workspaceRouter from './workspace.route.js'
import channelRouter from './channel.route.js'
import memberRouter from './member.route.js'

const router = express.Router();

router.use('/users',userRouter);
router.use('/workspaces',workspaceRouter);

router.use('/channels',channelRouter);
router.use('/members',memberRouter);

export default router;
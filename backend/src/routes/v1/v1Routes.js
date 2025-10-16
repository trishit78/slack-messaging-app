import express from 'express'; 

import userRouter from './user.route.js'
import workspaceRouter from './workspace.route.js'

const router = express.Router();

router.use('/users',userRouter);
router.use('/workspaces',workspaceRouter);


export default router;
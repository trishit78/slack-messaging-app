import express from 'express';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';
import { getChannelByIdController } from '../../controllers/channel.controller.js';


const router = express.Router();

router.use('/:channelId',isAuthenticated,getChannelByIdController);

export default router;
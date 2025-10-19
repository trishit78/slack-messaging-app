import express from 'express';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';
import { getMessages } from '../../controllers/message.controller.js';

const router = express.Router();

router.get('/messages/:channelId',isAuthenticated,getMessages);

export default router;
import express from 'express';
import { createWorkspaceController } from '../../controllers/workspace.controller.js';
import { validate } from '../../validators/zodValidator.js';
import { createWorkspaceSchema } from '../../validators/workspaceSchema.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();


router.post('/',isAuthenticated,validate(createWorkspaceSchema),createWorkspaceController);

export default router;
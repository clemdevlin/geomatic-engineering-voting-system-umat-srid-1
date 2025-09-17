import express from 'express';
import { getAdminDashboard, getDetailedAdminDashboard } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/admin/dashboard', authMiddleware, getAdminDashboard);
router.get('/admin/dashboard/detailed', authMiddleware, getDetailedAdminDashboard);

export default router;

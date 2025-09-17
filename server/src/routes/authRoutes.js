import express from 'express';
import { studentLogin, adminLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/auth/student/login', studentLogin);
router.post('/auth/admin/login', adminLogin);

export default router;

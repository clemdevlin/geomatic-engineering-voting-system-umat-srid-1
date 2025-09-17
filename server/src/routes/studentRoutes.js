import express from 'express';
import { getStudentStatus, getBallot, submitVote } from '../controllers/studentController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/student/status', authMiddleware, getStudentStatus);
router.get('/student/ballot', authMiddleware, getBallot);
router.post('/student/vote', authMiddleware, submitVote);

export default router;

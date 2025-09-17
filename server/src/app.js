import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import electionRoutes from './routes/electionRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "*"]
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// register routes under /api to match FastAPI prefix
app.use('/api', authRoutes);
app.use('/api', studentRoutes);
app.use('/api', adminRoutes);
app.use('/api', electionRoutes);
app.use('/api', uploadRoutes);

export default app;

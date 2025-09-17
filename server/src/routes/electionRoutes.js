import express from 'express';
import * as electionCtrl from '../controllers/electionController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/admin/elections/prerequisites', authMiddleware, electionCtrl.checkElectionsPrerequisites);
router.post('/admin/elections/complete', authMiddleware, electionCtrl.createCompleteElection);

router.get('/admin/elections/:election_id/details', authMiddleware, electionCtrl.getElectionDetails);
router.put('/admin/elections/:election_id', authMiddleware, electionCtrl.updateElection);
router.delete('/admin/elections/:election_id', authMiddleware, electionCtrl.deleteElection);

router.get('/admin/elections/templates', authMiddleware, electionCtrl.getElectionTemplates);
router.post('/admin/elections/:election_id/positions', authMiddleware, electionCtrl.createCompleteElection); // not used here

router.post('/admin/elections/:election_id/positions', authMiddleware, async (req,res)=>{ // create single position
  if(req.user.user_type !== 'admin') return res.status(403).json({ detail: 'Access forbidden' });
  const Position = (await import('../models/Position.js')).default;
  const p = new Position({ election_id: req.params.election_id, ...req.body });
  await p.save();
  return res.json(p);
});

router.post('/admin/positions/:position_id/candidates', authMiddleware, async (req,res)=>{
  if(req.user.user_type !== 'admin') return res.status(403).json({ detail: 'Access forbidden' });
  const Candidate = (await import('../models/Candidate.js')).default;
  const c = new Candidate({ position_id: req.params.position_id, ...req.body });
  await c.save();
  return res.json(c);
});

router.post('/admin/elections/:election_id/polls', authMiddleware, async (req,res)=>{
  if(req.user.user_type !== 'admin') return res.status(403).json({ detail: 'Access forbidden' });
  const Poll = (await import('../models/Poll.js')).default;
  const p = new Poll({ election_id: req.params.election_id, ...req.body });
  await p.save();
  return res.json(p);
});

router.get('/admin/results/:election_id', authMiddleware, electionCtrl.getResults);

export default router;

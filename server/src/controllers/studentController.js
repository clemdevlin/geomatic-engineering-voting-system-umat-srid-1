import Candidate from '../models/Candidate.js';
import Election from '../models/Election.js';
import Poll from '../models/Poll.js';
import Position from '../models/Position.js';
import Student from '../models/Student.js';
import Vote from '../models/Vote.js';
import { updateElectionStatus } from '../utils/electionUtils.js';

export async function getStudentStatus(req,res){
  if(req.user.user_type !== 'student') return res.status(403).json({ detail: 'Access forbidden' });
  await updateElectionStatus();
  try{
    const election = await Election.findOne({ status: { $in: ['not_started','active'] } });
    if(!election) return res.json({ status: 'no_election', message: 'No election scheduled' });
    const student = await Student.findOne({ _id: req.user.user_id });
    const current_time = new Date();
    return res.json({ election, has_voted: student.has_voted, current_time: current_time.toISOString(), can_vote: election.status === 'active' && !student.has_voted });
  }catch(e){
    console.log("ERROR GETTING STUDENT STATUS", e);
    
    return res.status(500).json({ detail: e.message });
  }
}

export async function getBallot(req,res){
  if(req.user.user_type !== 'student') return res.status(403).json({ detail: 'Access forbidden' });
  await updateElectionStatus();
  const election = await Election.findOne({ status: 'active' });
  if(!election) return res.status(400).json({ detail: 'Voting is not currently active' });
  const student = await Student.findOne({ _id: req.user.user_id });
  if(student.has_voted) return res.status(400).json({ detail: 'You have already voted' });
  const positionsData = await Position.find({ election_id: election._id }).sort({ order: 1 });
  const positions = [];
  for(const pos of positionsData){
    const candidates = await Candidate.find({ position_id: pos._id });
    positions.push({ position: pos, candidates });
  }
  const polls = await Poll.find({ election_id: election._id }).sort({ order: 1 });
  return res.json({ election, positions });
}

export async function submitVote(req,res){
  if(req.user.user_type !== 'student') return res.status(403).json({ detail: 'Access forbidden' });
  await updateElectionStatus();
  const election = await Election.findOne({ status: 'active' });
  if(!election) return res.status(400).json({ detail: 'Voting is not currently active' });
  const student = await Student.findOne({ _id: req.user.user_id });
  if(student.has_voted) return res.status(400).json({ detail: 'You have already voted' });
  const vote = new Vote({ student_id: student._id, election_id: election._id, selections: req.body.selections });
  await vote.save();
  await Student.updateOne({ _id: student._id }, { $set: { has_voted: true } });
  await Election.updateOne({ _id: election._id }, { $inc: { total_votes: 1 } });
  return res.json({ message: 'Vote submitted successfully' });
}

import Election from '../models/Election.js';
import Position from '../models/Position.js';
import Candidate from '../models/Candidate.js';
import Poll from '../models/Poll.js';
import Vote from '../models/Vote.js';
import Student from '../models/Student.js';

export async function checkElectionsPrerequisites(req, res){
  if(req.user.user_type !== 'admin') return res.status(403).json({ detail: 'Access forbidden' });
  const existing = await Election.findOne({ status: { $in: ['not_started','active'] } });
  const total_students = await Student.countDocuments();
  const recent = await Election.find().sort({ created_at: -1 }).limit(5);
  return res.json({
    can_create: !existing,
    active_election: existing || null,
    total_students,
    recent_elections: recent
  });
}

/*
export async function validateElectionData(req, res){
  if(req.user.user_type !== 'admin') return res.status(403).json({ detail: 'Access forbidden' });
  const data = req.body; // expecting FullElectionCreate structure
  const errors = {}; const warnings = [];
  const existing = await Election.findOne({ status: { $in: ['not_started','active'] } });
  if(existing) errors.general = 'There is already an active election';
  if(!data.name || !data.name.trim()) errors.name = 'Election name is required';
  if(data.name && data.name.length < 5) warnings.push('Election name is quite short');
  const now = new Date();
  if(new Date(data.start_at) <= now) errors.start_at = 'Start time must be in the future';
  if(new Date(data.end_at) <= new Date(data.start_at)) errors.end_at = 'End time must be after start time';
  const hours = (new Date(data.end_at) - new Date(data.start_at))/3600000;
  if(hours < 1) warnings.push('Voting period is less than 1 hour');
  if(hours > 168) warnings.push('Voting period is longer than 1 week');
  if(!data.positions || data.positions.length === 0) errors.positions = 'At least one position is required';
  else{
    const names = data.positions.map(p=>p.name.toLowerCase());
    if(names.length !== new Set(names).size) errors.positions = 'Position names must be unique';
    data.positions.forEach((p,i)=>{
      if(!p.candidates || p.candidates.length===0) errors[`position_${i}_candidates`] = `Position '${p.name}' must have at least one candidate`;
      else if(p.candidates.length===1) warnings.push(`Position '${p.name}' has only one candidate`);
    });
  }
  if(data.polls){
    const qs = data.polls.map(p=>p.question.toLowerCase());
    if(qs.length !== new Set(qs).size) warnings.push('Some poll questions are very similar');
  }
  const total_students = await Student.countDocuments();
  if(total_students === 0) errors.students = 'No students found. Please upload student data first.';
  else if(total_students < 10) warnings.push(`Only ${total_students} eligible voters found`);
  const valid = Object.keys(errors).length === 0;
  return res.json({ valid, errors, warnings });
}
  */

export async function validateElectionData(data, user) {
  const errors = {};
  const warnings = [];

  if (!user || user.user_type !== 'admin') {
    errors.auth = 'Access forbidden';
    return { valid: false, errors, warnings };
  }

  const existing = await Election.findOne({ status: { $in: ['not_started','active'] } });
  if (existing) errors.general = 'There is already an active election';

  if (!data.name || !data.name.trim()) errors.name = 'Election name is required';
  if (data.name && data.name.length < 5) warnings.push('Election name is quite short');

  const now = new Date();
  if (new Date(data.start_at) <= now) errors.start_at = 'Start time must be in the future';
  if (new Date(data.end_at) <= new Date(data.start_at)) errors.end_at = 'End time must be after start time';

  const hours = (new Date(data.end_at) - new Date(data.start_at)) / 3600000;
  if (hours < 1) warnings.push('Voting period is less than 1 hour');
  if (hours > 168) warnings.push('Voting period is longer than 1 week');

  if (!data.positions || data.positions.length === 0) {
    errors.positions = 'At least one position is required';
  } else {
    const names = data.positions.map(p => p.name.toLowerCase());
    if (names.length !== new Set(names).size) errors.positions = 'Position names must be unique';

    data.positions.forEach((p, i) => {
      if (!p.candidates || p.candidates.length === 0) {
        errors[`position_${i}_candidates`] = `Position '${p.name}' must have at least one candidate`;
      } else if (p.candidates.length === 1) {
        warnings.push(`Position '${p.name}' has only one candidate`);
      }
    });
  }

  if (data.polls) {
    const qs = data.polls.map(p => p.question.toLowerCase());
    if (qs.length !== new Set(qs).size) warnings.push('Some poll questions are very similar');
  }

  const total_students = await Student.countDocuments();
  if (total_students === 0) errors.students = 'No students found. Please upload student data first.';
  else if (total_students < 10) warnings.push(`Only ${total_students} eligible voters found`);

  const valid = Object.keys(errors).length === 0;
  return { valid, errors, warnings };
}


export async function createCompleteElection(req, res){
  if(req.user.user_type !== 'admin') return res.status(403).json({ detail: 'Access forbidden' });
  const data = req.body;
  const { valid, errors, warnings } = await validateElectionData(req.body, req.user);

  if (!valid) {
    return res.status(400).json({ valid, errors, warnings });
  }
  const existing = await Election.findOne({ status: { $in: ['not_started','active'] } });
  if(existing) return res.status(400).json({ detail: 'There is already an active election' });
  let election;
  try{
    const total_students = await Student.countDocuments();
    await Student.updateMany({}, { $set: { has_voted: false } });
    election = new Election({
      name: data.name,
      start_at: data.start_at,
      end_at: data.end_at,
      eligible_voters: total_students
    });
    await election.save();
    let total_candidates = 0;
    for(const pos of data.positions || []){
      const position = new Position({ election_id: election._id, name: pos.name, order: pos.order || 0 });
      await position.save();
      for(const candName of pos.candidates || []){
        if(candName && candName.trim()){
          console.log("CANDNAME", candName)
          const candidate = new Candidate({ position_id: position._id, name: candName.trim() });
          await candidate.save();
          total_candidates += 1;
        }
      }
    }
    for(const pollData of data.polls || []){
      const poll = new Poll({ election_id: election._id, question: pollData.question, order: pollData.order || 0 });
      await poll.save();
    }
    return res.json({
      election,
      positions_count: (data.positions || []).length,
      candidates_count: total_candidates,
      polls_count: (data.polls || []).length,
      eligible_voters: total_students
    });
  }catch(e){
    console.error("ELECTION CREATE ERROR", e)
    // cleanup best effort
    if(election && election._id){
      await Election.deleteOne({ id: election._id });
      await Position.deleteMany({ election_id: election._id });
      await Poll.deleteMany({ election_id: election._id });
    }
    return res.status(500).json({ detail: 'Failed to create election', error: e.message });
  }
}

export async function getElectionDetails(req, res){
  if(req.user.user_type !== 'admin') return res.status(403).json({ detail: 'Access forbidden' });
  const electionId = req.params.election_id;
  const electionData = await Election.findOne({ id: electionId });
  if(!electionData) return res.status(404).json({ detail: 'Election not found' });
  const positionsData = await Position.find({ election_id: electionId }).sort({ order: 1 });
  const positions = [];
  for(const pos of positionsData){
    const candidates = await Candidate.find({ position_id: pos._id });
    positions.push({ position: pos, candidates });
  }
  const polls = await Poll.find({ election_id: electionId }).sort({ order: 1 });
  const total_votes = await Vote.countDocuments({ election_id: electionId });
  const students_voted = await Student.countDocuments({ has_voted: true });
  const stats = {
    total_votes,
    students_voted,
    turnout_percentage: electionData.eligible_voters? (students_voted / electionData.eligible_voters * 100): 0,
    positions_count: positions.length,
    candidates_count: positions.reduce((s,p)=> s + (p.candidates?.length||0), 0),
    polls_count: polls.length
  };
  return res.json({ election: electionData, positions, polls, statistics: stats });
}

export async function updateElection(req, res){
  if(req.user.user_type !== 'admin') return res.status(403).json({ detail: 'Access forbidden' });
  const electionId = req.params.election_id;
  const data = req.body;
  const existing = await Election.findOne({ _id: electionId });
  if(!existing) return res.status(404).json({ detail: 'Election not found' });
  if(existing.status !== 'not_started') return res.status(400).json({ detail: 'Cannot update election that has started' });
  existing.name = data.name;
  existing.start_at = data.start_at;
  existing.end_at = data.end_at;
  await existing.save();
  return res.json(existing);
}

export async function deleteElection(req, res){
  if(req.user.user_type !== 'admin') return res.status(403).json({ detail: 'Access forbidden' });
  const electionId = req.params.election_id;
  console.warn("EelctionId from client", electionId)
  const existing = await Election.findOne({ _id: electionId });
  if(!existing) return res.status(404).json({ detail: 'Election not found' });
  if(existing.status !== 'not_started') return res.status(400).json({ detail: 'Cannot delete election that has started' });
  try{
    const positions = await Position.find({ election_id: electionId });
    for(const pos of positions){
      await Candidate.deleteMany({ position_id: pos._id });
    }
    await Position.deleteMany({ election_id: electionId });
    await Poll.deleteMany({ election_id: electionId });
    await Vote.deleteMany({ election_id: electionId });
    await Election.deleteOne({ _id: electionId });
    await Student.updateMany({}, { $set: { has_voted: false } });
    return res.json({ message: 'Election deleted successfully' });
  }catch(e){
    return res.status(500).json({ detail: 'Failed to delete election', error: e.message });
  }
}

export async function getElectionTemplates(req, res){
  if(req.user.user_type !== 'admin') return res.status(403).json({ detail: 'Access forbidden' });
  const templates = [
    { name: 'Class Representative Elections', positions: [{name:'Class Representative', description:'Main representative for the class'},{name:'Assistant Class Representative', description:'Assists the main representative'}], suggested_polls: ['Should we have more class social events?','Do you support extending library hours during exams?'] },
    { name: 'Student Union Elections', positions: [{name:'President', description:'Student Union President'},{name:'Vice President', description:'Student Union Vice President'},{name:'Secretary', description:'Student Union Secretary'},{name:'Treasurer', description:'Student Union Treasurer'}], suggested_polls: ['Should student union dues be increased?','Do you support the proposed new student center?'] },
    { name: 'Department Representative Elections', positions: [{name:'Level 100 Representative', description:'Representative for Level 100 students'},{name:'Level 200 Representative', description:'Representative for Level 200 students'},{name:'Level 300 Representative', description:'Representative for Level 300 students'},{name:'Level 400 Representative', description:'Representative for Level 400 students'}], suggested_polls: ['Should we organize more department social events?','Do you support the new curriculum changes?'] }
  ];
  return res.json({ templates });
}

export async function getResults(req, res){
  if(req.user.user_type !== 'admin') return res.status(403).json({ detail: 'Access forbidden' });
  const electionId = req.params.election_id;
  const electionData = await Election.findOne({ id: electionId });
  if(!electionData) return res.status(404).json({ detail: 'Election not found' });
  const votes = await Vote.find({ election_id: electionId });
  const positionsData = await Position.find({ election_id: electionId }).sort({ order: 1 });
  const position_results = [];
  for(const pos of positionsData){
    const candidates = await Candidate.find({ position_id: pos._id });
    const candidate_votes = {};
    for(const cand of candidates){
      const voteCount = votes.filter(v=> v.selections && v.selections[pos._id] === cand._id).length;
      candidate_votes[cand._id] = { name: cand.name, votes: voteCount, percentage: votes.length? (voteCount / votes.length * 100): 0 };
    }
    position_results.push({ position: pos, candidates: candidate_votes });
  }
  const polls = await Poll.find({ election_id: electionId }).sort({ order: 1 });
  const poll_results = [];
  for(const poll of polls){
    const yes = votes.filter(v=> v.selections && v.selections[poll._id] === 'yes').length;
    const no = votes.filter(v=> v.selections && v.selections[poll._id] === 'no').length;
    poll_results.push({ poll, yes_votes: yes, no_votes: no, yes_percentage: votes.length? (yes / votes.length * 100):0, no_percentage: votes.length? (no / votes.length * 100):0 });
  }
  const voted_student_ids = votes.map(v=> v.student_id);
  const non_voters = await Student.find({ id: { $nin: voted_student_ids } });
  return res.json({
    election: electionData,
    statistics: { eligible_voters: electionData.eligible_voters, total_votes: votes.length, turnout_percentage: electionData.eligible_voters? (votes.length / electionData.eligible_voters * 100):0 },
    position_results, poll_results,
    non_voters: non_voters.map(s=> ({ index_number: s.index_number, surname: s.surname }))
  });
}

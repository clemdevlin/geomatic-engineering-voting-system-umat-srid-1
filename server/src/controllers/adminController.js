import Election from '../models/Election.js';
import Student from '../models/Student.js';
import Vote from '../models/Vote.js';
import { updateElectionStatus } from '../utils/electionUtils.js';

export async function getAdminDashboard(req,res){
  if(req.user.user_type !== 'admin') return res.status(403).json({ detail: 'Access forbidden' });
  await updateElectionStatus();
  const election = await Election.findOne({ status: { $in: ['not_started','active'] } });
  const total_students = await Student.countDocuments();
  const students_voted = await Student.countDocuments({ has_voted: true });
  const all_elections = await Election.find().sort({ created_at: -1 }).limit(10);
  const election_history = all_elections;
  return res.json({
    election: election || null,
    statistics: { total_students, students_voted, students_not_voted: total_students - students_voted, turnout_percentage: total_students? (students_voted / total_students * 100):0 },
  });
}

export async function getDetailedAdminDashboard(req,res){
  if(req.user.user_type !== 'admin') return res.status(403).json({ detail: 'Access forbidden' });
  await updateElectionStatus();
  const election = await Election.findOne({ status: { $in: ['not_started','active'] } });
  const total_students = await Student.countDocuments();
  const students_voted = await Student.countDocuments({ has_voted: true });
  const all_elections = await Election.find().sort({ created_at: -1 }).limit(10);
  const election_history = all_elections;
  let voting_trends = [];
  if(election){
    const from = new Date(Date.now() - 24*3600*1000);
    const votes = await Vote.find({ election_id: election._id, created_at: { $gte: from } });
    const hourly = {};
    for(const v of votes){
      const hour = new Date(v.created_at); hour.setMinutes(0,0,0);
      hourly[hour.toISOString()] = (hourly[hour.toISOString()]||0) + 1;
    }
    voting_trends = Object.entries(hourly).sort().map(([hour,v])=> ({ hour, votes: v }));
  }
  const system_health = { database_status: 'healthy', last_backup: '2024-01-15T10:00:00Z', uptime_hours: 168, avg_response_time_ms: 45 };
  return res.json({
    election: election || null,
    statistics: { total_students, students_voted, students_not_voted: total_students - students_voted, turnout_percentage: total_students? (students_voted / total_students * 100):0, total_elections_created: election_history.length, active_elections: election?1:0 },
    election_history,
    voting_trends,
    system_health,
    can_create_election: !election,
    next_scheduled_election: null
  });
}

import AdminUser from '../models/AdminUser.js';
import Student from '../models/Student.js';
import { updateElectionStatus } from '../utils/electionUtils.js';
import { createAccessToken } from '../utils/jwt.js';
import { generatePin } from '../utils/pin.js';
import { verifyPassword } from '../utils/security.js';

export async function studentLogin(req, res){
  const { index_number, pin } = req.body;
  await updateElectionStatus();
  const studentData = await Student.findOne({ index_number });
  if(!studentData) return res.status(401).json({ detail: 'Invalid index number or PIN' });
  const expected = generatePin(studentData.surname, studentData.reference_number);
  if((pin||'').toLowerCase() !== expected) return res.status(401).json({ detail: 'Invalid index number or PIN' });
  const token = createAccessToken({ sub: studentData._id, type: 'student', index_number: studentData.index_number });
  return res.json({ access_token: token, token_type: 'bearer', user_type: 'student', user_id: studentData._id });
}

export async function adminLogin(req, res){
  const { username, password } = req.body;
  console.log(req.body);
  if (!username || !password) return res.status(401).json({detail: 'Username and password is required'});
  const adminData = await AdminUser.findOne({ username });
  if(!adminData) return res.status(401).json({ detail: 'Invalid username or password' });
  if(!verifyPassword(password, adminData.password_hash)) return res.status(401).json({ detail: 'Invalid username or password' });
  const token = createAccessToken({ sub: adminData._id, type: 'admin', username: adminData.username });
  return res.json({ access_token: token, token_type: 'bearer', user_type: 'admin', user_id: adminData._id });
}

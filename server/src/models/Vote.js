import mongoose from 'mongoose';

const VoteSchema = new mongoose.Schema({
  student_id: { type: String, required: true },
  election_id: { type: String, required: true },
  selections: { type: Object, default: {} },
  created_at: { type: Date, default: ()=> new Date() }
});

export default mongoose.model('Vote', VoteSchema);

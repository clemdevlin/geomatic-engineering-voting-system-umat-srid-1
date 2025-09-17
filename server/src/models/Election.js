import mongoose from 'mongoose';


const ElectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  start_at: { type: Date, required: true },
  end_at: { type: Date, required: true },
  status: { type: String, enum: ['not_started','active','ended'], default: 'not_started' },
  eligible_voters: { type: Number, default: 0 },
  total_votes: { type: Number, default: 0 },
  created_at: { type: Date, default: ()=> new Date() }
});

export default mongoose.model('Election', ElectionSchema);

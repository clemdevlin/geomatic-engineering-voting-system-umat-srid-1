import mongoose from 'mongoose';


const CandidateSchema = new mongoose.Schema({
  position_id: { type: String, required: true },
  name: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  created_at: { type: Date, default: ()=> new Date() }
});

export default mongoose.model('Candidate', CandidateSchema);

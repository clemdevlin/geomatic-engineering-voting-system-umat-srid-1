import mongoose from 'mongoose';


const PositionSchema = new mongoose.Schema({
  election_id: { type: String, required: true },
  name: { type: String, required: true },
  order: { type: Number, default: 0 },
  created_at: { type: Date, default: ()=> new Date() }
});

export default mongoose.model('Position', PositionSchema);

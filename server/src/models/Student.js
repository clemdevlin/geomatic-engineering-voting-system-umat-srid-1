import mongoose from 'mongoose';


const StudentSchema = new mongoose.Schema({
  index_number: { type: String, required: true, unique: true },
  surname: { type: String, required: true },
  reference_number: { type: String, required: true },
  has_voted: { type: Boolean, default: false },
  created_at: { type: Date, default: ()=> new Date() }
});

export default mongoose.model('Student', StudentSchema);

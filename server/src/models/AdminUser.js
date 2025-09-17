import mongoose from 'mongoose';



const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  created_at: { type: Date, default: ()=> new Date() }
});

export default mongoose.model('AdminUser', AdminSchema);

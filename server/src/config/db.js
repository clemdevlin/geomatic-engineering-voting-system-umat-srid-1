import mongoose from 'mongoose';
import 'dotenv/config';

export default async function connectDB(){
  const url = process.env.MONGO_URL;
  if(!url) throw new Error('MONGO_URL not set');
  await mongoose.connect(url);
  console.log('MongoDB connected');
}

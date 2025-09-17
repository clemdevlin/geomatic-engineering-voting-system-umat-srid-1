import dotenv from 'dotenv';
dotenv.config({ path: './src/.env' });
import app from './app.js';
import connectDB from './config/db.js';
import initAdmin from './initAdmin.js';

const PORT = process.env.PORT || 5000;

connectDB().then(async ()=>{
  await initAdmin();
  app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));
}).catch(err=>{
  console.error("Failed to connect DB", err);
  process.exit(1);
});

import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import { authMiddleware } from '../middleware/auth.js';
import Student from '../models/Student.js';
const router = express.Router();
const upload = multer();

router.post('/admin/students/upload', authMiddleware, upload.single('file'), async (req,res)=>{
  if(req.user.user_type !== 'admin') return res.status(403).json({ detail: 'Access forbidden' });
  if(!req.file) return res.status(400).json({ detail: 'File required' });
  if(!req.file.originalname.endsWith('.csv')) return res.status(400).json({ detail: 'File must be a CSV' });
  try{
    const rows = [];
    const str = req.file.buffer.toString('utf8');
    const lines = str.split('\n').filter(Boolean);
    const header = lines[0].split(',');
    const idx = header.map(h=>h.trim());
    for(let i=1;i<lines.length;i++){
      const cols = lines[i].split(',');
      const row = {};
      idx.forEach((k,j)=> row[k]= (cols[j]||'').trim());
      if(!('index_number' in row && 'surname' in row && 'reference_number' in row)){
        return res.status(400).json({ detail: 'CSV must have columns: index_number, surname, reference_number' });
      }
      rows.push(row);
    }
    if(rows.length){
      await Student.deleteMany({});
      const docs = rows.map(r=> ({ index_number: r.index_number, surname: r.surname, reference_number: r.reference_number }));
      await Student.insertMany(docs);
    }
    return res.json({ message: `Successfully uploaded ${rows.length} students` });
  }catch(e){
    return res.status(400).json({ detail: 'Error processing CSV', error: e.message });
  }
});

export default router;

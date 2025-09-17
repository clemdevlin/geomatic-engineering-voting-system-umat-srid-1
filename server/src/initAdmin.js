import AdminUser from './models/AdminUser.js';
import { hashPassword } from './utils/security.js';

export default async function initAdmin(){
  const exists = await AdminUser.findOne({ username: 'Bond442' });
  if(!exists){
    const a = new AdminUser({ username: 'Bond442', password_hash: hashPassword('admin442') });
    await a.save();
    console.log('Default admin created: Bond442');
  }
}

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRATION_HOURS = parseInt(process.env.JWT_EXPIRATION_HOURS || '24', 10);

export function createAccessToken(data){
  const toEncode = {...data};
  // expiry as seconds from now
  const exp = Math.floor(Date.now()/1000) + (JWT_EXPIRATION_HOURS * 3600);
  toEncode.exp = exp;
  return jwt.sign(toEncode, JWT_SECRET);
}

export function verifyToken(token){
  try{
    return jwt.verify(token, JWT_SECRET);
  }catch(e){
    return null;
  }
}

import { verifyToken } from '../utils/jwt.js';

export function authMiddleware(req, res, next){
  const auth = req.headers.authorization;
  if(!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ detail: 'Not authenticated' });
  const token = auth.split(' ')[1];
  const payload = verifyToken(token);
  if(!payload) return res.status(401).json({ detail: 'Invalid token' });
  req.user = { user_id: payload.sub, user_type: payload.type };
  next();
}

export function requireRole(role){
  return (req,res,next)=>{
    if(!req.user) return res.status(401).json({ detail: 'Not authenticated' });
    if(req.user.user_type !== role) return res.status(403).json({ detail: 'Access forbidden' });
    next();
  };
}

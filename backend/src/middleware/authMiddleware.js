const db = require('../config/db');
const { verifyToken } = require('../utils/jwt');

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }

  const user = db.prepare('SELECT id, name, email, role, phone, address, city, state, postal_code, country, is_active FROM users WHERE id = ?').get(decoded.id);
  if (!user) {
    return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists.' });
  }

  if (user.is_active === 0) {
    return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact support.' });
  }

  req.user = user;
  next();
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied: Administrator privileges required.' });
  }
  next();
};

const optionalAuth = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      const user = db.prepare('SELECT id, name, email, role, is_active FROM users WHERE id = ?').get(decoded.id);
      if (user && user.is_active === 1) {
        req.user = user;
      }
    }
  }
  next();
};

module.exports = {
  protect,
  adminOnly,
  optionalAuth
};

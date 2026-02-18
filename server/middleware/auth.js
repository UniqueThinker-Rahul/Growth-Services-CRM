const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const TeamMember = require('../models/TeamMember'); 

dotenv.config(); 

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_only_for_dev_do_not_use_in_prod';

if (!process.env.JWT_SECRET) {
    console.warn("⚠️  WARNING: JWT_SECRET is not set in .env file. Using unsafe default.");
}

// 1. VERIFY USER (From Cookie + Session Check)
const verifyToken = async (req, res, next) => {
  const token = req.cookies.token; 
  if (!token) return res.status(401).json({ message: 'Access Denied. Please login.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // --- SECURITY UPGRADE: Single Session Enforcement ---
    const user = await TeamMember.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found.' });

    // If session ID doesn't match, force logout
    if (user.sessionId && user.sessionId !== decoded.sessionId) {
        return res.status(401).json({ message: 'Session terminated. Logged in on another device.' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid Session or Expired' });
  }
};

// 2. DYNAMIC ROLE AUTHORIZATION
// Usage in routes: router.post('/', authorize('Admin', 'Manager'), ...)
const authorize = (...roles) => {
    return (req, res, next) => {
        // First, ensure the user is logged in (verifyToken should run before this)
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: No user found' });
        }

        // Check if user's role is in the allowed list
        // Note: 'Administrator' is treated same as 'Admin' in your system, so allow both if needed
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Access Denied. Required role: ${roles.join(' or ')}` 
            });
        }
        next();
    };
};

module.exports = { verifyToken, authorize, JWT_SECRET };
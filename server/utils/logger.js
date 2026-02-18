const ActivityLog = require('../models/ActivityLog');

const logAction = async (user, action, details) => {
  try {
    // 1. Safely determine the User Name/ID
    let userIdentifier = 'System';
    
    if (user) {
        // If user object exists, try name -> email -> id -> string
        userIdentifier = user.name || user.email || (user.id ? `User-${user.id}` : 'Unknown');
        
        // Sometimes 'user' might be passed as a direct string
        if (typeof user === 'string') userIdentifier = user;
    }

    // 2. Safely determine Role
    const userRole = user?.role || 'System';

    // 3. Create Log
    const logEntry = new ActivityLog({
      user: userIdentifier, // ERROR WAS HERE: Now it's guaranteed to have a value
      role: userRole,
      action: action,
      details: details,
      ip: '127.0.0.1'
    });

    await logEntry.save();
    console.log(`📝 Logged: ${action}`);

  } catch (err) {
    // Catch errors so they don't crash the server
    console.error('Logging failed (Non-fatal):', err.message); 
  }
};

module.exports = logAction;
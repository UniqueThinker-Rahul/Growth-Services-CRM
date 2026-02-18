const express = require('express');
const router = express.Router();
const ActivityLog = require('../models/ActivityLog'); // Or '../models/Log' if you renamed it
const { verifyToken, authorize } = require('../middleware/auth'); // Import security

// GET ALL LOGS (Strictly Admin Only)
router.get('/', verifyToken, authorize('Admin', 'Administrator'), async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DOWNLOAD CSV (Strictly Admin Only)
router.get('/download', verifyToken, authorize('Admin', 'Administrator'), async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 });
    
    // Convert to CSV format manually
    const csvHeader = 'User,Role,Action,Details,Time\n';
    const csvRows = logs.map(log => {
      // Escape quotes to prevent CSV breakage
      const safeDetails = log.details ? log.details.replace(/"/g, '""') : '';
      return `"${log.user}","${log.role}","${log.action}","${safeDetails}","${new Date(log.timestamp).toISOString()}"`;
    }).join('\n');

    res.header('Content-Type', 'text/csv');
    res.attachment('activity_logs.csv');
    return res.send(csvHeader + csvRows);
  } catch (err) {
    res.status(500).send('Error generating CSV');
  }
});

module.exports = router;
const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  user: { type: String, required: true },     // Who did it?
  role: { type: String, required: true },     // What is their role?
  action: { type: String, required: true },   // What did they do? (e.g. DELETE_LEAD)
  details: { type: String, required: true },  // Specifics (e.g. "Deleted lead: John Doe")
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
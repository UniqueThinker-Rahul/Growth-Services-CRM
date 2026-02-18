const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, default: 'Call' }, // Call, Email, Meeting
  priority: { type: String, default: 'Medium' }, // High, Medium, Low
  status: { type: String, default: 'Pending' }, // Pending, Completed
  due: { type: String, default: 'Today' },
  lead: { type: String, default: '' }, // Optional: Link to a lead name
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);
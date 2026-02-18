const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  value: { type: Number, default: 0 },
  source: { type: String, default: 'Manual Entry' },
  status: { type: String, default: 'New' },
  assigned: { type: String, default: 'Unassigned' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', LeadSchema);
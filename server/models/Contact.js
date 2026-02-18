const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, default: 'Active' }, // Active, Inactive, Do Not Contact
  lastContact: { type: String, default: 'Just now' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', ContactSchema);
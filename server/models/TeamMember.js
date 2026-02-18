const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // 1. EXPANDED ROLES
  role: { 
    type: String, 
    enum: ['Admin', 'Manager', 'Sales Rep', 'Support', 'Viewer', 'Developer'], 
    default: 'Sales Rep' 
  },
  
  // 2. SINGLE SESSION ENFORCEMENT
  sessionId: { type: String },

  // 3. BRUTE FORCE PROTECTION
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },

  // ... standard fields ...
  status: { type: String, default: 'Active' },
  avatar: { type: String },
  color: { type: String },
  phone: { type: String },
  deals: { type: Number, default: 0 },
  value: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

module.exports = mongoose.model('TeamMember', teamMemberSchema);
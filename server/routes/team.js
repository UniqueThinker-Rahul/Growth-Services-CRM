const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const TeamMember = require('../models/TeamMember');
const { verifyToken, authorize } = require('../middleware/auth'); // Import authorize
const logAction = require('../utils/logger');
const sendEmail = require('../utils/email');

// 1. GET TEAM (Admins & Managers)
router.get('/', verifyToken, authorize('Admin', 'Administrator', 'Manager', 'Sales Rep', 'Support', 'Viewer'), async (req, res) => {
  try {
    const members = await TeamMember.find().select('-password').sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. INVITE MEMBER (Admins & Managers)
router.post('/', verifyToken, authorize('Admin', 'Administrator', 'Manager'), async (req, res) => {
  try {
    const existingUser = await TeamMember.findOne({ email: req.body.email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Generate random secure password
    const generatedPassword = req.body.password || crypto.randomBytes(8).toString('hex');
    const initials = req.body.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const colors = ['red', 'blue', 'green', 'purple', 'pink', 'indigo'];

    const member = new TeamMember({
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      password: generatedPassword, // Will be auto-hashed by login logic later or add hashing here
      phone: req.body.phone,
      avatar: initials,
      color: colors[Math.floor(Math.random() * colors.length)],
      status: 'Active'
    });

    const newMember = await member.save();
    await logAction(req.user, 'INVITE_MEMBER', `Invited ${newMember.name} as ${newMember.role}`);

    // Send Email
    try {
        await sendEmail({
            email: newMember.email,
            subject: 'Welcome to GrowthService',
            message: `
                <h3>Welcome, ${newMember.name}!</h3>
                <p>You have been invited to the CRM.</p>
                <p><b>Email:</b> ${newMember.email}</p>
                <p><b>Password:</b> ${generatedPassword}</p>
                <a href="http://localhost:5173/login">Login Here</a>
            `
        });
    } catch (e) { console.error("Email failed:", e.message); }

    res.status(201).json(newMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. DELETE MEMBER (Strictly Admin Only)
router.delete('/:id', verifyToken, authorize('Admin', 'Administrator'), async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    // Prevent deleting yourself
    if (member._id.toString() === req.user.id) {
        return res.status(400).json({ message: "You cannot delete yourself." });
    }

    await TeamMember.findByIdAndDelete(req.params.id);
    await logAction(req.user, 'DELETE_MEMBER', `Removed user: ${member.name}`);
    res.json({ message: 'User removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Make sure you ran: npm install bcryptjs
const TeamMember = require('../models/TeamMember');
const sendEmail = require('../utils/email');
const { JWT_SECRET } = require('../middleware/auth');

// --- 1. LOGIN ROUTE (Secure) ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing credentials" });

    const user = await TeamMember.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    // --- SECURITY: Check Account Lock ---
    if (user.lockUntil && user.lockUntil > Date.now()) {
        return res.status(423).json({ message: "Account locked. Try again in 15 minutes." });
    }

    // --- SECURITY: Check Password ---
    const isMatch = user.password.startsWith('$2') 
      ? await bcrypt.compare(password, user.password)
      : user.password === password;

    if (!isMatch) {
        // Increment Failed Attempts
        user.loginAttempts += 1;
        
        // Lock if > 5 attempts
        if (user.loginAttempts >= 5) {
            user.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 mins
            await user.save();
            return res.status(423).json({ message: "Too many failed attempts. Account locked for 15 minutes." });
        }
        
        await user.save();
        return res.status(400).json({ message: `Invalid Credentials. (${5 - user.loginAttempts} attempts remaining)` });
    }

    // --- SUCCESSFUL LOGIN ---
    // Reset Lock counters
    user.loginAttempts = 0;
    user.lockUntil = undefined;

    // Generate New Session ID (Kills old sessions)
    const newSessionId = crypto.randomBytes(16).toString('hex');
    user.sessionId = newSessionId;

    // Auto-migrate legacy passwords
    if (!user.password.startsWith('$2')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    // Generate Token
    const token = jwt.sign(
      { id: user._id, role: user.role, sessionId: newSessionId }, 
      JWT_SECRET, 
      { expiresIn: '15m' } // 15 Min Hard Expiry
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000 
    });

    res.json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// --- 2. LOGOUT ROUTE ---
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// --- 3. FORGOT PASSWORD (BYPASS FIX APPLIED) ---
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await TeamMember.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 Minutes
    await user.save();

    // Uses your live URL from Render Environment Variables, or localhost as fallback
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;
    
    // TEMPORARY BYPASS: Log to Render Console instead of emailing
    try {
      console.log("\n==========================================");
      console.log("🚀 PASSWORD RESET LINK GENERATED");
      console.log("User:", user.email);
      console.log("Link:", resetUrl);
      console.log("==========================================\n");
      
      // Tell frontend success so the button stops loading
      res.status(200).json({ success: true, message: "Reset link generated in server logs" });
    } catch (err) {
      // Rollback if something fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ message: "Failed to generate link" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 4. UPDATE PASSWORD ROUTE ---
router.put('/update-password', async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    // 1. Find the user in the database
    const user = await TeamMember.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 2. Check if the current password matches
    // Note: handling both plain text (legacy) and hashed passwords for safety
    const isMatch = user.password.startsWith('$2') 
      ? await bcrypt.compare(currentPassword, user.password)
      : user.password === currentPassword;

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password." });
    }

    // 3. Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 4. Update and save
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Update Password Error:", error);
    res.status(500).json({ message: "Server error while updating password." });
  }
});

module.exports = router;

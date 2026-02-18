const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit'); 
const Lead = require('../models/Lead');
const { verifyToken, authorize } = require('../middleware/auth'); 
const logAction = require('../utils/logger'); 
const { validateLead } = require('../middleware/validate');

// --- RATE LIMITER FOR PUBLIC FORM ---
const publicFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 5, 
  message: { message: "Too many requests from this IP, please try again in an hour." },
  standardHeaders: true, 
  legacyHeaders: false, 
});

// --- PUBLIC ROUTE (No Auth Required) ---
router.post('/public', publicFormLimiter, validateLead, async (req, res) => {
  try {
    const leadData = {
        name: req.body.name,
        email: req.body.email,
        company: req.body.company || 'Not Provided',
        phone: req.body.phone,
        source: 'Website Form', 
        status: 'New',          
        assigned: 'Unassigned', 
        value: 0
    };

    const lead = new Lead(leadData);
    const newLead = await lead.save();

    await logAction({ name: 'Public Website', role: 'System' }, 'CREATE_LEAD', `New Web Inquiry: ${newLead.name}`);
    
    res.status(201).json({ success: true, message: 'Inquiry received' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 1. GET ALL (Protected + RBAC)
// FIX: Added 'Support' and 'Viewer' so the Dashboard loads for them!
router.get('/', verifyToken, authorize('Admin', 'Administrator', 'Manager', 'Sales Rep', 'Support', 'Viewer'), async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. CREATE (Protected + RBAC)
router.post('/', verifyToken, authorize('Admin', 'Administrator', 'Manager', 'Sales Rep'), validateLead, async (req, res) => {
  const lead = new Lead(req.body);
  try {
    const newLead = await lead.save();
    await logAction(req.user, 'CREATE_LEAD', `Created lead: ${newLead.name} for ${newLead.company}`);
    res.status(201).json(newLead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. UPDATE (Protected + RBAC)
router.put('/:id', verifyToken, authorize('Admin', 'Administrator', 'Manager', 'Sales Rep'), validateLead, async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (req.body.status) {
        await logAction(req.user, 'UPDATE_LEAD', `Updated status of ${updatedLead.name} to ${req.body.status}`);
    }
    res.json(updatedLead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. DELETE (Protected + STRICT RBAC)
// FIX: Restored the actual DELETE logic (you had a duplicate GET here)
router.delete('/:id', verifyToken, authorize('Admin', 'Administrator', 'Manager'), async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (lead) {
        await Lead.findByIdAndDelete(req.params.id);
        await logAction(req.user, 'DELETE_LEAD', `Deleted lead: ${lead.name}`);
        res.json({ message: 'Lead deleted' });
    } else {
        res.status(404).json({ message: 'Lead not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
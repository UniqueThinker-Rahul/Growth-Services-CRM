const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// 1. GET ALL CONTACTS
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. CREATE NEW CONTACT
router.post('/', async (req, res) => {
  const contact = new Contact({
    name: req.body.name,
    role: req.body.role,
    company: req.body.company,
    email: req.body.email,
    status: 'Active',
    lastContact: 'Just now'
  });

  try {
    const newContact = await contact.save();
    res.status(201).json(newContact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. DELETE CONTACT
router.delete('/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
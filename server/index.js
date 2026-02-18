const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

console.log("Debug Mongo URI:", process.env.MONGO_URI);

const app = express();

// 1. SECURITY & CONFIGURATION
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// 2. CORS (Fixes the blocking error)
app.use(cors({
  origin: [
    "http://localhost:5173", // Standard Vite Port
    "http://localhost:5174", // Backup Vite Port
    "http://localhost:5175",
    "https://growthservice-crm.vercel.app" // Future Deployment
  ],
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// 3. RATE LIMITING (Global)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, 
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

// 4. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 5. ROUTES (Fixes the 404 Error)
// Make sure these files exist in your /routes folder!
app.use('/api/auth', require('./routes/auth'));       // Login/Logout/Reset
app.use('/api/leads', require('./routes/leads'));     // Leads management
app.use('/api/team', require('./routes/team'));       // Team management
app.use('/api/contacts', require('./routes/contacts')); // Contacts
app.use('/api/logs', require('./routes/logs'));       // Admin logs
app.use('/api/analytics', require('./routes/analytics')); // Dashboard stats

// 6. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

// 7. START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
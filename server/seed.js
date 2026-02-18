const mongoose = require('mongoose');
const TeamMember = require('./models/TeamMember');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to DB");

    // Check if admin exists
    const existingAdmin = await TeamMember.findOne({ email: 'admin@growth.io' });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists.");
      process.exit();
    }

    // Create Admin
    const admin = new TeamMember({
      name: 'Admin User',
      email: 'admin@growth.io',
      password: 'password123', // Set a known password
      role: 'Admin',
      status: 'Active',
      avatar: 'AU',
      color: 'purple'
    });

    await admin.save();
    console.log("🎉 Admin created! Login with: admin@growth.io / password123");
    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

seedAdmin();
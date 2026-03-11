// One-time script to fix double-hashed passwords caused by the createMentor.js bug.
// The bug: passwords were manually bcrypt-hashed before passing to User.create(),
// but the User model pre-save hook also hashes them — resulting in double-hashing.
// Fix: load each user, set plain-text password, call .save() so the hook hashes it once.
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = require('../config/db');
const User = require('../models/User');

const ACCOUNTS = [
  { email: 'mentor@edureach.in',  password: 'mentor123456' },
  { email: 'student@edureach.in', password: 'student123456' },
  { email: 'admin@edureach.in',   password: 'admin123456' },
];

(async () => {
  await connectDB();
  for (const { email, password } of ACCOUNTS) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) { console.log(`⚠️  Not found: ${email}`); continue; }
    user.password = password;   // plain text — pre-save hook will hash it once
    await user.save();
    console.log(`✅ Password reset for ${email} → ${password}`);
  }
  process.exit(0);
})();

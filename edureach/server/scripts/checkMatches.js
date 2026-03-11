require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = require('../config/db');
require('../models/User'); // register schema for populate
const MentorMatch = require('../models/MentorMatch');

(async () => {
  await connectDB();
  const matches = await MentorMatch.find({})
    .populate('student', 'name email')
    .populate('mentor', 'name email');
  console.log(JSON.stringify(matches.map(m => ({
    _id: m._id,
    student: m.student?.email,
    mentor: m.mentor?.email,
    status: m.status,
    createdAt: m.createdAt,
  })), null, 2));
  process.exit(0);
})();

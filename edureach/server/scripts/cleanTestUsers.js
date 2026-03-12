// One-time script to delete specific test users from the DB.
// Usage: node scripts/cleanTestUsers.js
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const User = require('../models/User');

const emailsToDelete = [
  'velorateam7@gmail.com',
  // add more test emails here if needed
];

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  const result = await User.deleteMany({ email: { $in: emailsToDelete } });
  console.log(`Deleted ${result.deletedCount} user(s):`, emailsToDelete);

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

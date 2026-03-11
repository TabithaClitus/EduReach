require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;

  // Clear MentorMatch collection
  try {
    const result = await db.collection('mentormatches').deleteMany({});
    console.log(`✅ Cleared ${result.deletedCount} MentorMatch records`);
  } catch (e) {
    console.log('ℹ️  No mentormatches collection found (skipping)');
  }

  // Reset all students
  const students = await db.collection('users').updateMany(
    { role: 'student' },
    { $set: { mentorshipStatus: 'none', myMentor: null, requestedMentorId: null } }
  );
  console.log(`✅ Reset ${students.modifiedCount} student records`);

  // Reset all mentors — clear their request array
  const mentors = await db.collection('users').updateMany(
    { role: 'mentor' },
    { $set: { mentorshipRequests: [] } }
  );
  console.log(`✅ Reset ${mentors.modifiedCount} mentor records`);

  console.log('\n✅ All requests reset successfully. You can now test the flow fresh.');
  mongoose.disconnect();
});

require('dotenv').config()
const dns = require('dns')
dns.setDefaultResultOrder('ipv4first')
dns.setServers(['8.8.8.8', '8.8.4.4'])
const mongoose = require('mongoose')
const User = require('../models/User')
const Mentor = require('../models/Mentor')

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://tabithaclitus_db_user:4dk6qCJS7N5nRhi5@cluster0.pu3xysb.mongodb.net/edureach')

async function create() {
  await mongoose.connection.once('open', async () => {

    // Create Mentor
    let mentorUser = await User.findOne({ email: 'mentor@edureach.in' })
    if (!mentorUser) {
      mentorUser = await User.create({ name: 'Arjun Sharma', email: 'mentor@edureach.in', password: 'mentor123456', role: 'mentor' })
      console.log('✅ Mentor user created: mentor@edureach.in / mentor123456')
    } else {
      console.log('ℹ️ Mentor user already exists:', mentorUser._id.toString())
    }

    // Create / update Mentor profile document
    const existingProfile = await Mentor.findOne({ user: mentorUser._id })
    if (!existingProfile) {
      await Mentor.create({
        user: mentorUser._id,
        subjects: ['Mathematics', 'Physics', 'Science'],
        languages: ['en', 'hi'],
        bio: 'IIT Bombay graduate with 5 years of teaching experience in Maths and Physics. Passionate about helping students crack board exams.',
        rating: 4.8,
        totalSessions: 0,
        availability: 'Weekdays 4–7 PM, Weekends 10 AM–1 PM',
      })
      console.log('✅ Mentor profile created for:', mentorUser.name)
    } else {
      console.log('ℹ️ Mentor profile already exists')
    }

    // Create Admin
    const adminExists = await User.findOne({ email: 'admin@edureach.in' })
    if (!adminExists) {
      await User.create({ name: 'EduReach Admin', email: 'admin@edureach.in', password: 'admin123456', role: 'admin' })
      console.log('✅ Admin created: admin@edureach.in / admin123456')
    } else {
      await User.updateOne({ email: 'admin@edureach.in' }, { role: 'admin' })
      console.log('ℹ️ Admin role updated')
    }

    // Create Student
    const studentExists = await User.findOne({ email: 'student@edureach.in' })
    if (!studentExists) {
      await User.create({ name: 'Test Student', email: 'student@edureach.in', password: 'student123456', role: 'student' })
      console.log('✅ Student created: student@edureach.in / student123456')
    } else {
      console.log('ℹ️ Student already exists')
    }

    console.log('\n=== LOGIN CREDENTIALS ===')
    console.log('Student:  student@edureach.in / student123456')
    console.log('Mentor:   mentor@edureach.in  / mentor123456')
    console.log('Admin:    admin@edureach.in   / admin123456')

    process.exit()
  })
}
create()

require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/User')
const bcrypt = require('bcryptjs')

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://tabithaclitus_db_user:4dk6qCJS7N5nRhi5@cluster0.pu3xysb.mongodb.net/edureach')

async function create() {
  await mongoose.connection.once('open', async () => {

    // Create Mentor
    const mentorExists = await User.findOne({ email: 'mentor@edureach.in' })
    if (!mentorExists) {
      const pwd = await bcrypt.hash('mentor123456', 10)
      await User.create({ name: 'Arjun Sharma', email: 'mentor@edureach.in', password: pwd, role: 'mentor' })
      console.log('✅ Mentor created: mentor@edureach.in / mentor123456')
    } else {
      console.log('ℹ️ Mentor already exists')
    }

    // Create Admin
    const adminExists = await User.findOne({ email: 'admin@edureach.in' })
    if (!adminExists) {
      const pwd = await bcrypt.hash('admin123456', 10)
      await User.create({ name: 'EduReach Admin', email: 'admin@edureach.in', password: pwd, role: 'admin' })
      console.log('✅ Admin created: admin@edureach.in / admin123456')
    } else {
      await User.updateOne({ email: 'admin@edureach.in' }, { role: 'admin' })
      console.log('ℹ️ Admin role updated')
    }

    // Create Student
    const studentExists = await User.findOne({ email: 'student@edureach.in' })
    if (!studentExists) {
      const pwd = await bcrypt.hash('student123456', 10)
      await User.create({ name: 'Test Student', email: 'student@edureach.in', password: pwd, role: 'student' })
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

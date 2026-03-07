require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const Course = require("./models/Course");
const User = require("./models/User");
const Mentor = require("./models/Mentor");

const MONGO_URI = process.env.MONGO_URI;

// ==========================
// COURSES â€” Real NCERT / Diksha content
// ==========================
const courses = [
  {
    title: "Class 1-2 Maths â€” Numbers & Counting",
    description:
      "Learn counting, number recognition, addition and subtraction basics designed for young learners following the NCERT curriculum.",
    subject: "Mathematics",
    language: ["en"],
    videoUrl: "https://www.youtube.com/embed/qdSbVMCPw5E",
    thumbnailUrl: "https://img.youtube.com/vi/qdSbVMCPw5E/hqdefault.jpg",
    tags: ["ncert", "maths", "primary", "numbers"],
    gradeLevel: "Class 1-2",
    isFree: true,
  },
  {
    title: "à®µà®•à¯à®ªà¯à®ªà¯ 3-5 à®•à®£à®¿à®¤à®®à¯ â€” à®ªà®¿à®©à¯à®©à®™à¯à®•à®³à¯ à®®à®±à¯à®±à¯à®®à¯ à®¤à®šà®®à®™à¯à®•à®³à¯",
    description:
      "à®¤à®®à®¿à®´à¯ à®µà®´à®¿à®¯à®¿à®²à¯ à®ªà®¿à®©à¯à®©à®™à¯à®•à®³à¯, à®¤à®šà®®à®™à¯à®•à®³à¯ à®®à®±à¯à®±à¯à®®à¯ à®…à®³à®µà¯€à®Ÿà¯ à®ªà®±à¯à®±à®¿à®¯ NCERT à®ªà®¾à®Ÿà®¤à¯à®¤à®¿à®Ÿà¯à®Ÿà®®à¯.",
    subject: "Mathematics",
    language: ["ta"],
    videoUrl: "https://www.youtube.com/embed/5iUh_CSjaSw",
    thumbnailUrl: "https://img.youtube.com/vi/5iUh_CSjaSw/hqdefault.jpg",
    tags: ["diksha", "maths", "tamil", "fractions"],
    gradeLevel: "Class 3-5",
    isFree: true,
  },
  {
    title: "à¤•à¤•à¥à¤·à¤¾ 6-8 à¤µà¤¿à¤œà¥à¤žà¤¾à¤¨ â€” à¤¬à¤² à¤”à¤° à¤—à¤¤à¤¿",
    description:
      "à¤¹à¤¿à¤¨à¥à¤¦à¥€ à¤®à¥‡à¤‚ NCERT à¤µà¤¿à¤œà¥à¤žà¤¾à¤¨ â€” à¤¬à¤², à¤—à¤¤à¤¿, à¤˜à¤°à¥à¤·à¤£ à¤”à¤° à¤—à¥à¤°à¥à¤¤à¥à¤µà¤¾à¤•à¤°à¥à¤·à¤£ à¤•à¥€ à¤¬à¥à¤¨à¤¿à¤¯à¤¾à¤¦à¥€ à¤…à¤µà¤§à¤¾à¤°à¤£à¤¾à¤à¤à¥¤",
    subject: "Science",
    language: ["hi"],
    videoUrl: "https://www.youtube.com/embed/oKqCf_F2yVg",
    thumbnailUrl: "https://img.youtube.com/vi/oKqCf_F2yVg/hqdefault.jpg",
    tags: ["ncert", "science", "hindi", "force", "motion"],
    gradeLevel: "Class 6-8",
    isFree: true,
  },
  {
    title: "Class 9-10 Maths â€” Algebra & Polynomials",
    description:
      "Master algebraic expressions, polynomials, linear equations and coordinate geometry as per NCERT Class 9-10 syllabus.",
    subject: "Mathematics",
    language: ["en"],
    videoUrl: "https://www.youtube.com/embed/1xSQlwWGT8M",
    thumbnailUrl: "https://img.youtube.com/vi/1xSQlwWGT8M/hqdefault.jpg",
    tags: ["ncert", "maths", "algebra", "polynomials"],
    gradeLevel: "Class 9-10",
    isFree: true,
  },
  {
    title: "Class 9-10 Science â€” Chemical Reactions & Equations",
    description:
      "NCERT Science covering chemical reactions, balancing equations, types of reactions, acids, bases and salts.",
    subject: "Science",
    language: ["en"],
    videoUrl: "https://www.youtube.com/embed/TnM7vbYqlBs",
    thumbnailUrl: "https://img.youtube.com/vi/TnM7vbYqlBs/hqdefault.jpg",
    tags: ["ncert", "science", "chemistry", "reactions"],
    gradeLevel: "Class 9-10",
    isFree: true,
  },
  {
    title: "Class 11-12 Physics â€” Laws of Motion",
    description:
      "Newton's laws of motion, friction, circular motion and applications. Comprehensive NCERT Class 11 Physics.",
    subject: "Physics",
    language: ["en"],
    videoUrl: "https://www.youtube.com/embed/1C17YbHSYDo",
    thumbnailUrl: "https://img.youtube.com/vi/1C17YbHSYDo/hqdefault.jpg",
    tags: ["ncert", "physics", "newton", "motion"],
    gradeLevel: "Class 11-12",
    isFree: true,
  },
  {
    title: "Class 11-12 Chemistry â€” Atomic Structure",
    description:
      "Bohr model, quantum numbers, electronic configuration, and periodic properties. NCERT Class 11 Chemistry.",
    subject: "Chemistry",
    language: ["en"],
    videoUrl: "https://www.youtube.com/embed/htAPYgeVCYQ",
    thumbnailUrl: "https://img.youtube.com/vi/htAPYgeVCYQ/hqdefault.jpg",
    tags: ["ncert", "chemistry", "atoms", "quantum"],
    gradeLevel: "Class 11-12",
    isFree: true,
  },
  {
    title: "Class 11-12 Maths â€” Calculus â€” Limits & Derivatives",
    description:
      "Introduction to limits, derivatives, differentiation rules and applications. NCERT Class 11 Mathematics.",
    subject: "Mathematics",
    language: ["en"],
    videoUrl: "https://www.youtube.com/embed/WUvTyaaNkzM",
    thumbnailUrl: "https://img.youtube.com/vi/WUvTyaaNkzM/hqdefault.jpg",
    tags: ["ncert", "maths", "calculus", "limits", "derivatives"],
    gradeLevel: "Class 11-12",
    isFree: true,
  },
  {
    title: "à®µà®•à¯à®ªà¯à®ªà¯ 6-8 à®šà®®à¯‚à®• à®…à®±à®¿à®µà®¿à®¯à®²à¯ â€” à®‡à®¨à¯à®¤à®¿à®¯ à®µà®°à®²à®¾à®±à¯",
    description:
      "à®¤à®®à®¿à®´à¯ à®µà®´à®¿à®¯à®¿à®²à¯ à®ªà®£à¯à®Ÿà¯ˆà®¯ à®‡à®¨à¯à®¤à®¿à®¯ à®¨à®¾à®•à®°à®¿à®•à®™à¯à®•à®³à¯, à®®à¯à®•à®²à®¾à®¯à®°à¯à®•à®³à¯ à®®à®±à¯à®±à¯à®®à¯ à®šà¯à®¤à®¨à¯à®¤à®¿à®°à®ªà¯ à®ªà¯‹à®°à®¾à®Ÿà¯à®Ÿà®®à¯.",
    subject: "Social Science",
    language: ["ta"],
    videoUrl: "https://www.youtube.com/embed/rNHqL-4qMRs",
    thumbnailUrl: "https://img.youtube.com/vi/rNHqL-4qMRs/hqdefault.jpg",
    tags: ["diksha", "social-science", "tamil", "history"],
    gradeLevel: "Class 6-8",
    isFree: true,
  },
  {
    title: "Class 9-10 English Literature â€” Prose & Poetry",
    description:
      "NCERT English â€” Beehive & Moments textbook chapters, poetry analysis, comprehension and writing skills.",
    subject: "English",
    language: ["en"],
    videoUrl: "https://www.youtube.com/embed/AH2BjXlMNkk",
    thumbnailUrl: "https://img.youtube.com/vi/AH2BjXlMNkk/hqdefault.jpg",
    tags: ["ncert", "english", "literature", "prose", "poetry"],
    gradeLevel: "Class 9-10",
    isFree: true,
  },
  {
    title: "Class 11-12 Biology â€” Cell Structure & Function",
    description:
      "Cell theory, organelles, cell division (mitosis & meiosis), biomolecules. NCERT Class 11 Biology.",
    subject: "Biology",
    language: ["en"],
    videoUrl: "https://www.youtube.com/embed/URUJD5NEXC8",
    thumbnailUrl: "https://img.youtube.com/vi/URUJD5NEXC8/hqdefault.jpg",
    tags: ["ncert", "biology", "cell", "mitosis"],
    gradeLevel: "Class 11-12",
    isFree: true,
  },
  {
    title: "Class 11-12 Computer Science â€” Python Programming",
    description:
      "Introduction to Python â€” variables, data types, loops, functions, file handling as per CBSE CS syllabus.",
    subject: "Computer Science",
    language: ["en"],
    videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8",
    thumbnailUrl: "https://img.youtube.com/vi/kqtD5dpn9C8/hqdefault.jpg",
    tags: ["cbse", "cs", "python", "programming"],
    gradeLevel: "Class 11-12",
    isFree: true,
  },
  {
    title: "à°¤à°°à°—à°¤à°¿ 6-8 à°—à°£à°¿à°¤à°‚ â€” à°œà±à°¯à°¾à°®à°¿à°¤à°¿ à°ªà±à°°à°¾à°¥à°®à°¿à°•à°¾à°²à±",
    description:
      "à°¤à±†à°²à±à°—à±à°²à±‹ NCERT à°—à°£à°¿à°¤à°‚ â€” à°°à±‡à°–à°²à±, à°•à±‹à°£à°¾à°²à±, à°¤à±à°°à°¿à°­à±à°œà°¾à°²à± à°®à°°à°¿à°¯à± à°šà°¤à±à°°à±à°­à±à°œà°¾à°² à°ªà±à°°à°¾à°¥à°®à°¿à°•à°¾à°²à±.",
    subject: "Mathematics",
    language: ["te"],
    videoUrl: "https://www.youtube.com/embed/dBjHd_nqn7c",
    thumbnailUrl: "https://img.youtube.com/vi/dBjHd_nqn7c/hqdefault.jpg",
    tags: ["diksha", "maths", "telugu", "geometry"],
    gradeLevel: "Class 6-8",
    isFree: true,
  },
  {
    title: "à²¤à²°à²—à²¤à²¿ 3-5 à²‡à²‚à²—à³à²²à²¿à²·à³ â€” Reading & Vocabulary",
    description:
      "à²•à²¨à³à²¨à²¡ à²®à²¾à²§à³à²¯à²® à²µà²¿à²¦à³à²¯à²¾à²°à³à²¥à²¿à²—à²³à²¿à²—à³† à²‡à²‚à²—à³à²²à²¿à²·à³ à²“à²¦à³à²µà²¿à²•à³†, à²ªà²¦à²œà²¾à²² à²®à²¤à³à²¤à³ à²µà³à²¯à²¾à²•à²°à²£.",
    subject: "English",
    language: ["kn"],
    videoUrl: "https://www.youtube.com/embed/kT6WLqiHbJc",
    thumbnailUrl: "https://img.youtube.com/vi/kT6WLqiHbJc/hqdefault.jpg",
    tags: ["diksha", "english", "kannada", "reading"],
    gradeLevel: "Class 3-5",
    isFree: true,
  },
  {
    title: "à¤•à¤•à¥à¤·à¤¾ 9-10 à¤‡à¤¤à¤¿à¤¹à¤¾à¤¸ â€” à¤­à¤¾à¤°à¤¤ à¤•à¤¾ à¤¸à¥à¤µà¤¤à¤‚à¤¤à¥à¤°à¤¤à¤¾ à¤¸à¤‚à¤—à¥à¤°à¤¾à¤®",
    description:
      "à¤¹à¤¿à¤¨à¥à¤¦à¥€ à¤®à¥‡à¤‚ NCERT à¤‡à¤¤à¤¿à¤¹à¤¾à¤¸ â€” 1857 à¤•à¤¾ à¤µà¤¿à¤¦à¥à¤°à¥‹à¤¹ à¤¸à¥‡ à¤²à¥‡à¤•à¤° 1947 à¤¤à¤• à¤­à¤¾à¤°à¤¤à¥€à¤¯ à¤¸à¥à¤µà¤¤à¤‚à¤¤à¥à¤°à¤¤à¤¾ à¤†à¤‚à¤¦à¥‹à¤²à¤¨à¥¤",
    subject: "History",
    language: ["hi"],
    videoUrl: "https://www.youtube.com/embed/jb0MtNqg7-0",
    thumbnailUrl: "https://img.youtube.com/vi/jb0MtNqg7-0/hqdefault.jpg",
    tags: ["ncert", "history", "hindi", "independence"],
    gradeLevel: "Class 9-10",
    isFree: true,
  },
];

// ==========================
// SEED FUNCTION
// ==========================
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Find or create an admin user for course createdBy
    let admin = await User.findOne({ role: "admin" });
    if (!admin) {
      admin = await User.create({
        name: "EduReach Admin",
        email: "admin@edureach.in",
        password: "admin123456",
        role: "admin",
        language: "en",
        state: "All",
      });
      console.log("Created admin user: admin@edureach.in / admin123456");
    }

    // Clear existing seed data
    await Course.deleteMany({});
    console.log("Cleared existing courses.");

    // Insert courses with admin as creator
    const courseDocs = courses.map((c) => ({ ...c, createdBy: admin._id }));
    const insertedCourses = await Course.insertMany(courseDocs);
    console.log(`Seeded ${insertedCourses.length} courses.`);

    // ── Mentor seed data ──────────────────────────────────────
    const mentorData = [
      {
        name: "Arjun Sharma", email: "arjun.mentor@edureach.in", password: "mentor123",
        language: "hi", state: "Uttar Pradesh",
        subjects: ["Mathematics", "Physics"], languages: ["hi", "en"],
        bio: "IIT Bombay graduate with 5 years teaching experience in Maths and Physics. Helped 80+ students crack JEE.",
        rating: 4.8, totalSessions: 92,
      },
      {
        name: "Priya Nair", email: "priya.mentor@edureach.in", password: "mentor123",
        language: "ml", state: "Kerala",
        subjects: ["Science", "Biology", "Chemistry"], languages: ["ml", "en"],
        bio: "MBBS doctor and passionate educator. Specialises in NEET preparation and life sciences for Classes 10–12.",
        rating: 4.9, totalSessions: 115,
      },
      {
        name: "Suresh Babu", email: "suresh.mentor@edureach.in", password: "mentor123",
        language: "ta", state: "Tamil Nadu",
        subjects: ["Mathematics", "Computer Science"], languages: ["ta", "en"],
        bio: "Software engineer at a Bangalore startup. Teaches Python, algorithms and Class 11-12 Maths on weekends.",
        rating: 4.7, totalSessions: 64,
      },
      {
        name: "Meena Reddy", email: "meena.mentor@edureach.in", password: "mentor123",
        language: "te", state: "Andhra Pradesh",
        subjects: ["English", "History", "Geography"], languages: ["te", "en", "hi"],
        bio: "MA English Literature from Hyderabad University. Helps rural students build English fluency and board exam confidence.",
        rating: 4.6, totalSessions: 78,
      },
      {
        name: "Ravi Kumar", email: "ravi.mentor@edureach.in", password: "mentor123",
        language: "kn", state: "Karnataka",
        subjects: ["Mathematics", "Science"], languages: ["kn", "en"],
        bio: "Class 10 topper turned mentor. Focuses on concept clarity for Classes 6–10 using simple, visual explanations.",
        rating: 4.5, totalSessions: 43,
      },
      {
        name: "Fatima Sheikh", email: "fatima.mentor@edureach.in", password: "mentor123",
        language: "hi", state: "Maharashtra",
        subjects: ["Chemistry", "Biology"], languages: ["hi", "en", "ml"],
        bio: "PhD scholar in Biochemistry. Passionate about making science accessible to first-generation learners.",
        rating: 4.9, totalSessions: 57,
      },
    ];

    for (const m of mentorData) {
      let mentorUser = await User.findOne({ email: m.email });
      if (!mentorUser) {
        mentorUser = await User.create({
          name: m.name, email: m.email, password: m.password,
          role: "mentor", language: m.language, state: m.state,
        });
      }
      const existingProfile = await Mentor.findOne({ user: mentorUser._id });
      if (!existingProfile) {
        await Mentor.create({
          user: mentorUser._id,
          subjects: m.subjects,
          languages: m.languages,
          bio: m.bio,
          rating: m.rating,
          totalSessions: m.totalSessions,
        });
      }
    }
    console.log(`Seeded ${mentorData.length} mentor profiles.`);
    // ─────────────────────────────────────────────────────────

    console.log("\n✅ Seed complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();

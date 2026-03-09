import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const quickStats = [
  { icon: '📖', label: 'Lessons Completed', value: '24', color: '#2563EB', bg: '#EFF6FF' },
  { icon: '🏆', label: 'Quizzes Passed', value: '8', color: '#059669', bg: '#ECFDF5' },
  { icon: '💰', label: 'Scholarships Applied', value: '3', color: '#D97706', bg: '#FFFBEB' },
  { icon: '🤝', label: 'Mentor Sessions', value: '12', color: '#7C3AED', bg: '#F5F3FF' },
];

const activeCourses = [
  { subject: 'Mathematics', topic: 'Quadratic Equations', progress: 65, color: '#2563EB' },
  { subject: 'Science', topic: "Newton's Laws", progress: 40, color: '#059669' },
  { subject: 'English', topic: 'Grammar Basics', progress: 80, color: '#7C3AED' },
];

const activities = [
  { icon: '✅', text: 'Completed lesson: Algebra Basics', time: '2 hours ago', color: '#059669' },
  { icon: '📝', text: 'Scored 80% on Science Quiz', time: 'Yesterday', color: '#2563EB' },
  { icon: '💰', text: 'Applied for NSP Scholarship', time: '2 days ago', color: '#D97706' },
  { icon: '🤝', text: 'Session with Arjun Sharma', time: '3 days ago', color: '#7C3AED' },
];

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: 88, paddingBottom: 64, fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>

        {/* SECTION 1 — WELCOME HEADER */}
        <div style={{
          background: 'linear-gradient(135deg, #1D4ED8, #7C3AED)',
          borderRadius: 20, padding: 40, marginBottom: 28, color: 'white',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <p style={{ fontSize: 16, opacity: 0.85, margin: '0 0 4px' }}>👋 Welcome back,</p>
            <p style={{ fontSize: 36, fontWeight: 800, margin: '0 0 8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {user?.name || 'Student'}
            </p>
            <p style={{ fontSize: 15, opacity: 0.8, margin: 0 }}>
              Ready to continue your learning journey today?
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button
                onClick={() => navigate('/learning')}
                style={{ background: 'white', color: '#1D4ED8', padding: '12px 24px', borderRadius: 10, fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}
              >
                📚 Continue Learning
              </button>
              <button
                onClick={() => navigate('/quiz')}
                style={{ background: 'transparent', color: 'white', padding: '12px 24px', borderRadius: 10, fontWeight: 600, border: '1.5px solid white', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}
              >
                📝 Take a Quiz
              </button>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 24, minWidth: 180 }}>
            {[
              { icon: '🔥', num: '7', label: 'Day Streak' },
              { icon: '📚', num: '3', label: 'Courses Active' },
              { icon: '⭐', num: '850', label: 'Points Earned' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: i < 2 ? 12 : 0 }}>
                <span style={{ fontSize: 24, fontWeight: 800 }}>{s.icon} {s.num}</span>
                <span style={{ fontSize: 12, opacity: 0.8 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2 — QUICK STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {quickStats.map((stat, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 14, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ fontSize: 28, fontWeight: 800, color: stat.color, margin: 0, lineHeight: 1 }}>{stat.value}</p>
                <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* SECTION 3 — TWO COLUMN */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>

          {/* LEFT — Continue Learning */}
          <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: '0 0 20px' }}>📚 Continue Learning</p>
            {activeCourses.map((course, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: i < activeCourses.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: course.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: course.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{course.subject}</p>
                  <p style={{ margin: '2px 0 6px', fontSize: 14, color: '#0F172A' }}>{course.topic}</p>
                  <div style={{ background: '#F1F5F9', height: 6, borderRadius: 3 }}>
                    <div style={{ background: course.color, height: '100%', borderRadius: 3, width: `${course.progress}%` }} />
                  </div>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: course.color, margin: 0, flexShrink: 0 }}>{course.progress}%</p>
              </div>
            ))}
            <p
              onClick={() => navigate('/learning')}
              style={{ marginTop: 16, color: '#2563EB', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 0 }}
            >
              View All Courses →
            </p>
          </div>

          {/* RIGHT COLUMN */}
          <div>
            {/* Upcoming Quiz */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 16 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>📝 Next Quiz</p>
              <p style={{ fontSize: 14, color: '#64748B', margin: '4px 0 4px' }}>Quadratic Equations</p>
              <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>10 questions • 15 min</p>
              <button
                onClick={() => navigate('/quiz/demo-1')}
                style={{ width: '100%', background: '#2563EB', color: 'white', border: 'none', padding: 10, borderRadius: 8, fontWeight: 600, marginTop: 16, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}
              >
                Start Quiz
              </button>
            </div>

            {/* My Mentor */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>🤝 My Mentor</p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#DBEAFE', color: '#2563EB', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>
                  AS
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#0F172A' }}>Arjun Sharma</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: '#059669' }}>● Online</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/mentoring')}
                style={{ width: '100%', background: '#059669', color: 'white', border: 'none', padding: 10, borderRadius: 8, fontWeight: 600, marginTop: 16, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}
              >
                Open Chat
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 4 — RECENT ACTIVITY */}
        <div style={{ background: 'white', borderRadius: 16, padding: 28, marginTop: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: '0 0 20px' }}>🕐 Recent Activity</p>
          {activities.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '12px 0', borderBottom: i < activities.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                {a.icon}
              </div>
              <p style={{ flex: 1, fontSize: 14, color: '#374151', margin: 0 }}>{a.text}</p>
              <p style={{ fontSize: 12, color: '#94A3B8', margin: 0, flexShrink: 0 }}>{a.time}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}


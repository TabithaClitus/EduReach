import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import GalaxyPlanet from '../components/common/GalaxyPlanet';

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

const formatTime = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

const typeColors = {
  quiz: '#6c63ff', lesson: '#10b981', mentor: '#f59e0b',
  studyplan: '#3b82f6', badge: '#ef4444', default: '#94A3B8',
};




export default function Dashboard() {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();

  // TEMPORARY — gradual preview counter (revert after preview)
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [newBadgeAlert, setNewBadgeAlert] = useState(null);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [hasMentor, setHasMentor] = useState(false);
  const [hasStudyPlan, setHasStudyPlan] = useState(false);
  const [activities, setActivities] = useState([]);

  // TEMPORARY — gradual preview: tick up streak every 2s to show all evolution stages
  useEffect(() => {
    const id = setInterval(() => {
      setStreak(prev => {
        if (prev >= 70) { clearInterval(id); return prev; }
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!token) return;
    // TEMPORARY — streak/update call disabled so hardcoded value isn't overridden
    // api.post('/streak/update').then(({ data }) => {
    //   setStreak(data.streak);
    //   setLongestStreak(data.longestStreak);
    //   if (data.newBadges?.length > 0) setNewBadgeAlert(data.newBadges[0]);
    // }).catch(() => {});
    api.get('/streak').then(({ data }) => {
      const badges = data.badges || [];
      setEarnedBadges(badges);
      setTotalQuizzes(data.totalQuizzes || 0);
      setHasMentor(badges.some(b => b.id === 'first_mentor'));
      setHasStudyPlan(badges.some(b => b.id === 'study_plan'));
    }).catch(() => {});
    api.get('/activity').then(({ data }) => {
      setActivities(data.activities || []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (newBadgeAlert) {
      const t = setTimeout(() => setNewBadgeAlert(null), 3000);
      return () => clearTimeout(t);
    }
  }, [newBadgeAlert]);

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

        {/* LEARNING TREE + ACTIVITY FEED */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20, marginBottom: 24 }}>
          {/* Galaxy Planet */}
          <div style={{ boxShadow: '0 2px 24px rgba(80,0,180,0.18)', borderRadius: 20, overflow: 'hidden', minHeight: 420 }}>
            <GalaxyPlanet
              studyStreak={streak}
              quizScore={totalQuizzes}
              hasMentor={hasMentor}
              hasStudyPlan={hasStudyPlan}
            />
          </div>

          {/* Activity Feed */}
          <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#0F172A', marginBottom: 20 }}>🕐 Recent Activity</div>
            {activities.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: 13, paddingTop: 24 }}>
                No activity yet — start learning! 🚀
              </div>
            ) : activities.map((a, i) => {
              const color = typeColors[a.type] || typeColors.default;
              return (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: i < activities.length - 1 ? 16 : 0, marginBottom: i < activities.length - 1 ? 16 : 0, borderBottom: i < activities.length - 1 ? `2px solid ${color}22` : 'none' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 4, boxShadow: `0 0 0 3px ${color}33` }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 13, color: '#374151', fontWeight: 500 }}>{a.icon} {a.text}</p>
                    <p style={{ margin: '3px 0 0', fontSize: 11, color: '#94A3B8' }}>{formatTime(a.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
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

      </div>

      {/* Badge earned toast */}
      {newBadgeAlert && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          background: '#1a1a2e', color: '#fff',
          borderRadius: 16, padding: '16px 24px',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          zIndex: 9999, animation: 'slideInToast 0.3s ease',
        }}>
          <style>{`@keyframes slideInToast { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
          <span style={{ fontSize: 32 }}>{newBadgeAlert.icon}</span>
          <div>
            <div style={{ fontWeight: 700 }}>Badge Unlocked! 🎉</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>{newBadgeAlert.name}</div>
          </div>
        </div>
      )}
    </div>
  );
}


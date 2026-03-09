import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// ─── Sample Data ──────────────────────────────────────────────────────────────

const STUDENTS = [
  { id: 1, name: 'Kavya Reddy', grade: '10th', subject: 'Mathematics', progress: 78, sessions: 12, avatar: 'KR', color: '#2563EB', bg: '#EFF6FF', status: 'active', nextSession: 'Tomorrow, 4 PM' },
  { id: 2, name: 'Arjun Singh', grade: '11th', subject: 'Physics', progress: 65, sessions: 8, avatar: 'AS', color: '#059669', bg: '#ECFDF5', status: 'active', nextSession: 'Wed, 5 PM' },
  { id: 3, name: 'Meera Das', grade: '9th', subject: 'English', progress: 90, sessions: 15, avatar: 'MD', color: '#D97706', bg: '#FFFBEB', status: 'active', nextSession: 'Thu, 3 PM' },
  { id: 4, name: 'Sam Thomas', grade: '12th', subject: 'Chemistry', progress: 45, sessions: 4, avatar: 'ST', color: '#7C3AED', bg: '#F5F3FF', status: 'inactive', nextSession: 'Not scheduled' },
];

const QUIZ_RESULTS = [
  { id: 1, name: 'Maths Quiz 1', score: 85, passed: true },
  { id: 2, name: 'Science Quiz', score: 60, passed: true },
  { id: 3, name: 'English Quiz', score: 40, passed: false },
];

const STUDY_PLAN = [
  { week: 'Week 1', topic: 'Algebra Basics', status: 'done' },
  { week: 'Week 2', topic: 'Quadratic Equations', status: 'ongoing' },
  { week: 'Week 3', topic: 'Trigonometry', status: 'pending' },
];

const STATUS_ICON = { done: '✅', ongoing: '⏳', pending: '🔲' };

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ value }) {
  const color = value >= 75 ? '#059669' : value >= 50 ? '#D97706' : '#EF4444';
  return (
    <div style={{ background: '#F1F5F9', height: 10, borderRadius: 5 }}>
      <div style={{ background: color, height: '100%', borderRadius: 5, width: `${value}%`, transition: 'width 0.5s' }} />
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, color, bg }) {
  return (
    <div style={{ background: 'white', borderRadius: 14, padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 24, fontWeight: 800, color, margin: 0, lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: 12, color: '#64748B', margin: '4px 0 0' }}>{label}</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = STUDENTS.find(s => s.id === Number(id));

  const [notes, setNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);

  const handleSaveNotes = () => {
    setSavedNotes(notes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  if (!student) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: 120, textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
        <p style={{ fontSize: 48 }}>🔍</p>
        <p style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>Student not found</p>
        <button onClick={() => navigate('/mentor-dashboard?tab=students')}
          style={{ marginTop: 16, padding: '10px 24px', background: '#2563EB', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          ← Back to Students
        </button>
      </div>
    );
  }

  const progressColor = student.progress >= 75 ? '#059669' : student.progress >= 50 ? '#D97706' : '#EF4444';
  const progressBg = student.progress >= 75 ? '#ECFDF5' : student.progress >= 50 ? '#FFFBEB' : '#FEF2F2';

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: 88, paddingBottom: 64, fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>

        {/* Back button */}
        <button onClick={() => navigate('/mentor-dashboard?tab=students')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#2563EB', fontWeight: 600, fontSize: 14, cursor: 'pointer', padding: '0 0 20px', fontFamily: 'inherit' }}>
          ← Back to My Students
        </button>

        {/* Header card */}
        <div style={{ background: 'white', borderRadius: 20, padding: '28px 32px', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 68, height: 68, borderRadius: '50%', background: student.bg, color: student.color, fontWeight: 800, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {student.avatar}
            </div>
            {student.status === 'active' && (
              <div style={{ position: 'absolute', bottom: 3, right: 3, width: 14, height: 14, borderRadius: '50%', background: '#059669', border: '2.5px solid white' }} />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{student.name}</p>
              <span style={{
                fontSize: 12, fontWeight: 700, padding: '3px 12px', borderRadius: 999,
                background: student.status === 'active' ? '#ECFDF5' : '#F1F5F9',
                color: student.status === 'active' ? '#059669' : '#94A3B8',
              }}>
                {student.status === 'active' ? '● Active' : '○ Inactive'}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: '#64748B' }}>
              Grade {student.grade} &nbsp;·&nbsp; {student.subject}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          <StatCard icon="📈" label="Overall Progress" value={`${student.progress}%`} color={progressColor} bg={progressBg} />
          <StatCard icon="📚" label="Sessions Completed" value={student.sessions} color="#2563EB" bg="#EFF6FF" />
          <StatCard icon="📝" label="Quizzes Taken" value={QUIZ_RESULTS.length} color="#7C3AED" bg="#F5F3FF" />
          <StatCard icon="🗺️" label="Study Plan" value={student.status === 'active' ? 'Active' : 'Not Started'} color={student.status === 'active' ? '#059669' : '#94A3B8'} bg={student.status === 'active' ? '#ECFDF5' : '#F8FAFC'} />
        </div>

        {/* Two-column body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

          {/* ── Left column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Progress Overview */}
            <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <p style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: '#0F172A' }}>📊 Progress Overview</p>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <div style={{ position: 'relative', width: 140, height: 140 }}>
                  <svg width="140" height="140" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="58" fill="none" stroke="#F1F5F9" strokeWidth="14" />
                    <circle cx="70" cy="70" r="58" fill="none" stroke={progressColor} strokeWidth="14"
                      strokeDasharray={`${(student.progress / 100) * 364.4} 364.4`}
                      strokeLinecap="round"
                      transform="rotate(-90 70 70)" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 28, fontWeight: 800, color: progressColor }}>{student.progress}%</span>
                    <span style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>progress</span>
                  </div>
                </div>
              </div>
              <ProgressBar value={student.progress} />
              <p style={{ textAlign: 'center', fontSize: 13, color: '#64748B', marginTop: 10 }}>
                {student.progress >= 75 ? '✓ On track — great performance!' : student.progress >= 50 ? '~ Making progress — needs consistency' : '⚠ Below target — needs immediate support'}
              </p>
            </div>

            {/* Weak student alert */}
            {student.progress < 50 && (
              <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderLeft: '4px solid #f59e0b', borderRadius: 12, padding: '16px 20px' }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#92400e' }}>⚠️ This student needs extra attention</p>
                <p style={{ margin: '6px 0 0', fontSize: 13, color: '#b45309' }}>Progress is below 50%. Consider scheduling an additional session or sending study resources.</p>
              </div>
            )}

            {/* Mentor Notes */}
            <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <p style={{ margin: '0 0 14px', fontSize: 17, fontWeight: 700, color: '#0F172A' }}>📝 Mentor Notes</p>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={`Add private notes about ${student.name}...`}
                rows={5}
                style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, color: '#374151', resize: 'vertical', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', background: '#F8FAFC' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                <button onClick={handleSaveNotes}
                  style={{ padding: '9px 22px', background: '#2563EB', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
                  Save Notes
                </button>
                {notesSaved && <span style={{ fontSize: 13, color: '#059669', fontWeight: 600 }}>✓ Saved!</span>}
              </div>
              {savedNotes && (
                <div style={{ marginTop: 14, padding: '10px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <p style={{ margin: 0, fontSize: 12, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>LAST SAVED NOTE</p>
                  <p style={{ margin: 0, fontSize: 13, color: '#374151' }}>{savedNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Right column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Quiz Results */}
            <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <p style={{ margin: '0 0 18px', fontSize: 17, fontWeight: 700, color: '#0F172A' }}>🧪 Recent Quiz Results</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {QUIZ_RESULTS.map(q => (
                  <div key={q.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{q.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: q.passed ? '#059669' : '#EF4444' }}>{q.score}%</span>
                      <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                        background: q.passed ? '#ECFDF5' : '#FEF2F2',
                        color: q.passed ? '#059669' : '#EF4444' }}>
                        {q.passed ? '✅ Passed' : '❌ Failed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Plan */}
            <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <p style={{ margin: '0 0 18px', fontSize: 17, fontWeight: 700, color: '#0F172A' }}>🗺️ Study Plan Progress</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {STUDY_PLAN.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, background: item.status === 'done' ? '#F0FDF4' : item.status === 'ongoing' ? '#FFFBEB' : '#F8FAFC', border: `1px solid ${item.status === 'done' ? '#BBF7D0' : item.status === 'ongoing' ? '#FDE68A' : '#F1F5F9'}` }}>
                    <span style={{ fontSize: 20 }}>{STATUS_ICON[item.status]}</span>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#64748B' }}>{item.week}</p>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{item.topic}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Session */}
            <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <p style={{ margin: '0 0 16px', fontSize: 17, fontWeight: 700, color: '#0F172A' }}>📅 Upcoming Session</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: student.nextSession === 'Not scheduled' ? '#94A3B8' : '#0F172A' }}>
                    {student.nextSession === 'Not scheduled' ? '—' : student.nextSession}
                  </p>
                  {student.nextSession === 'Not scheduled' && (
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94A3B8' }}>No session scheduled yet</p>
                  )}
                </div>
                <button
                  onClick={() => setRescheduling(r => !r)}
                  style={{ padding: '9px 20px', background: 'transparent', color: '#6c63ff', border: '2px solid #6c63ff', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
                  📅 {student.nextSession === 'Not scheduled' ? 'Schedule' : 'Reschedule'}
                </button>
              </div>
              {rescheduling && (
                <div style={{ marginTop: 16, padding: '14px 16px', background: '#f8f9ff', borderRadius: 10, border: '1px solid #e0e7ff' }}>
                  <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 600, color: '#374151' }}>Pick a new time:</p>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {['Mon 4–6 PM', 'Wed 5–7 PM', 'Sat 10–12 PM'].map(slot => (
                      <button key={slot} onClick={() => setRescheduling(false)}
                        style={{ padding: '7px 14px', borderRadius: 8, border: '1.5px solid #e0e7ff', background: 'white', color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

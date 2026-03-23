import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function formatMsgTime(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function sortByRecent(a, b) { return (b._ts || 0) - (a._ts || 0); }

// ─── Sample Data ──────────────────────────────────────────────────────────────

const REQUESTS = [
  { id: 1, name: 'Aisha Patel', grade: 'Class 10', subject: 'Mathematics', time: '2 hours ago', message: 'I struggle with quadratic equations and need guidance before my board exams.', avatar: 'AP', color: '#2563EB', bg: '#EFF6FF' },
  { id: 2, name: 'Rohan Mehta', grade: 'Class 11', subject: 'Physics', time: '5 hours ago', message: 'Thermodynamics concepts are really hard for me. Can you help me understand them?', avatar: 'RM', color: '#059669', bg: '#ECFDF5' },
  { id: 3, name: 'Priya Sharma', grade: 'Class 9', subject: 'Science', time: 'Yesterday', message: "My school teacher moves too fast and I can't keep up. Need extra support.", avatar: 'PS', color: '#7C3AED', bg: '#F5F3FF' },
];

const STUDENTS = [
  { id: 1, name: 'Kavya Reddy', grade: 'Class 10', subject: 'Mathematics', progress: 78, sessions: 6, nextSession: 'Tomorrow, 4 PM', avatar: 'KR', color: '#2563EB', bg: '#EFF6FF', online: true },
  { id: 2, name: 'Arjun Singh', grade: 'Class 12', subject: 'Physics', progress: 65, sessions: 4, nextSession: 'Wed, 5 PM', avatar: 'AS', color: '#059669', bg: '#ECFDF5', online: false },
  { id: 3, name: 'Meera Das', grade: 'Class 11', subject: 'Chemistry', progress: 90, sessions: 9, nextSession: 'Thu, 3 PM', avatar: 'MD', color: '#D97706', bg: '#FFFBEB', online: true },
  { id: 4, name: 'Sam Thomas', grade: 'Class 9', subject: 'Science', progress: 45, sessions: 2, nextSession: 'Fri, 6 PM', avatar: 'ST', color: '#7C3AED', bg: '#F5F3FF', online: false },
];

const CHATS_INIT = [
  {
    id: 1, name: 'Kavya Reddy', avatar: 'KR', color: '#2563EB', bg: '#EFF6FF', online: true,
    lastMsg: 'Thank you sir!', time: '2:10 PM', unread: 2,
    messages: [
      { id: 1, from: 'student', text: 'Hi sir, can we go over Chapter 4 today?', time: '2:00 PM' },
      { id: 2, from: 'mentor', text: 'Sure! Letʼs start with the formulas.', time: '2:01 PM' },
      { id: 3, from: 'student', text: 'I got confused on problem 6.', time: '2:05 PM' },
      { id: 4, from: 'mentor', text: 'Show me your working and Iʼll point out the mistake.', time: '2:07 PM' },
      { id: 5, from: 'student', text: 'Thank you sir!', time: '2:10 PM' },
    ],
  },
  {
    id: 2, name: 'Arjun Singh', avatar: 'AS', color: '#059669', bg: '#ECFDF5', online: false,
    lastMsg: 'Got it, I will try again.', time: '11:30 AM', unread: 0,
    messages: [
      { id: 1, from: 'mentor', text: 'How did the practice problems go?', time: '11:15 AM' },
      { id: 2, from: 'student', text: 'I solved 7 out of 10 correctly.', time: '11:18 AM' },
      { id: 3, from: 'mentor', text: 'Good progress! Review problems 3, 7 and 9.', time: '11:25 AM' },
      { id: 4, from: 'student', text: 'Got it, I will try again.', time: '11:30 AM' },
    ],
  },
  {
    id: 3, name: 'Meera Das', avatar: 'MD', color: '#D97706', bg: '#FFFBEB', online: true,
    lastMsg: 'See you Thursday!', time: 'Yesterday', unread: 0,
    messages: [
      { id: 1, from: 'student', text: 'Sir, can we shift Thursdayʼs session to 3 PM?', time: 'Yesterday' },
      { id: 2, from: 'mentor', text: 'No problem, 3 PM works for me.', time: 'Yesterday' },
      { id: 3, from: 'student', text: 'See you Thursday!', time: 'Yesterday' },
    ],
  },
  {
    id: 4, name: 'Sam Thomas', avatar: 'ST', color: '#7C3AED', bg: '#F5F3FF', online: false,
    lastMsg: "I'll prepare the questions.", time: 'Monday', unread: 1,
    messages: [
      { id: 1, from: 'mentor', text: 'Welcome Sam! What areas do you need most help with?', time: 'Monday' },
      { id: 2, from: 'student', text: 'Mostly Electricity and Light chapters.', time: 'Monday' },
      { id: 3, from: 'mentor', text: 'Great. Iʼll send you some resources before Friday.', time: 'Monday' },
      { id: 4, from: 'student', text: "I'll prepare the questions.", time: 'Monday' },
    ],
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, color, bg }) {
  return (
    <div style={{ background: 'white', borderRadius: 14, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 28, fontWeight: 800, color, margin: 0, lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>{label}</p>
      </div>
    </div>
  );
}

function Avatar({ initials, bg, color, size = 40, fontSize = 14 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function SubjectBadge({ subject, color, bg }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color, background: bg, padding: '3px 10px', borderRadius: 999 }}>
      {subject}
    </span>
  );
}

function ProgressBar({ value }) {
  const color = value >= 75 ? '#059669' : value >= 50 ? '#D97706' : '#EF4444';
  const bg = value >= 75 ? '#ECFDF5' : value >= 50 ? '#FFFBEB' : '#FEF2F2';
  return (
    <div style={{ background: '#F1F5F9', height: 6, borderRadius: 3 }}>
      <div style={{ background: color, height: '100%', borderRadius: 3, width: `${value}%`, transition: 'width 0.4s' }} />
    </div>
  );
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────

function OverviewTab({ requests, handleTabClick }) {
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const weakStudents = STUDENTS.filter(s => s.progress < 50);

  return (
    <div>
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard icon="🎓" label="My Students" value={STUDENTS.length} color="#2563EB" bg="#EFF6FF" />
        <StatCard icon="📩" label="Pending Requests" value={requests.length} color="#D97706" bg="#FFFBEB" />
        <StatCard icon="💬" label="Active Chats" value="4" color="#7C3AED" bg="#F5F3FF" />
        <StatCard icon="✅" label="Sessions Done" value="21" color="#059669" bg="#ECFDF5" />
      </div>

      {/* Weak student alert banner */}
      {!bannerDismissed && weakStudents.length > 0 && (
        <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderLeft: '4px solid #f59e0b', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, color: '#92400e', fontWeight: 500 }}>
            ⚠️ <strong>{weakStudents.length} student{weakStudents.length > 1 ? 's' : ''}</strong> need{weakStudents.length === 1 ? 's' : ''} attention this week — their progress is below 50%. Consider reaching out.
          </span>
          <button onClick={() => setBannerDismissed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#b45309', lineHeight: 1, padding: '0 4px', marginLeft: 16 }}>&#x2715;</button>
        </div>
      )}

      {/* Upcoming Sessions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: '0 0 20px' }}>📅 Upcoming Sessions</p>
          {STUDENTS.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < STUDENTS.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
              <Avatar initials={s.avatar} bg={s.bg} color={s.color} size={40} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#0F172A' }}>{s.name}</p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748B' }}>{s.nextSession}</p>
              </div>
              <SubjectBadge subject={s.subject} color={s.color} bg={s.bg} />
            </div>
          ))}
        </div>

        {/* Recent Requests */}
        <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: 0 }}>📩 Recent Requests</p>
            {requests.length > 0 && (
              <span onClick={() => handleTabClick('Requests')} style={{ fontSize: 13, color: '#2563EB', fontWeight: 600, cursor: 'pointer' }}>View all →</span>
            )}
          </div>
          {requests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#64748B' }}>
              <p style={{ fontSize: 32, marginBottom: 8 }}>🎉</p>
              <p style={{ fontSize: 14 }}>All caught up! No pending requests.</p>
            </div>
          ) : (
            requests.slice(0, 3).map((r, i) => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < Math.min(requests.length, 3) - 1 ? '1px solid #F8FAFC' : 'none' }}>
                <Avatar initials={r.avatar} bg={r.bg} color={r.color} size={40} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#0F172A' }}>{r.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748B' }}>{r.grade} · {r.subject}</p>
                </div>
                <SubjectBadge subject={r.subject} color={r.color} bg={r.bg} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Student Progress */}
      <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: '0 0 20px' }}>📊 Student Progress</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {STUDENTS.map(s => (
            <div key={s.id} style={{ textAlign: 'center', padding: 16, borderRadius: 12, border: '1px solid #F1F5F9' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 8 }}>
                <Avatar initials={s.avatar} bg={s.bg} color={s.color} size={48} fontSize={16} />
                {s.online && <div style={{ position: 'absolute', bottom: 1, right: 1, width: 12, height: 12, borderRadius: '50%', background: '#059669', border: '2px solid white' }} />}
              </div>
              <p style={{ fontWeight: 600, fontSize: 14, color: '#0F172A', margin: '0 0 2px' }}>{s.name}</p>
              <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 10px' }}>{s.sessions} sessions</p>
              <ProgressBar value={s.progress} />
              <p style={{ fontSize: 13, fontWeight: 700, color: s.progress >= 75 ? '#059669' : s.progress >= 50 ? '#D97706' : '#EF4444', marginTop: 6 }}>{s.progress}%</p>
              <p style={{ fontSize: 12, fontWeight: 600, margin: '4px 0 0', color: s.progress >= 75 ? '#059669' : s.progress < 50 ? '#EF4444' : '#94A3B8' }}>
                {s.progress >= 75 ? '✓ On track' : s.progress < 50 ? '⚠ Needs attention' : ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Transform API request → UI row ──────────────────────────────────────────
// Handles both User-embedded format { studentName, grade, subject, matchId, createdAt }
// and old MentorMatch-populate format { student: { name }, subject, createdAt }

function transformMatch(item) {
  const name = item.studentName || item.student?.name || 'Student';
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['#2563EB', '#059669', '#7C3AED', '#D97706', '#DC2626'];
  const bgs   = ['#EFF6FF', '#ECFDF5', '#F5F3FF', '#FFFBEB', '#FEF2F2'];
  const idx = name.charCodeAt(0) % colors.length;
  const elapsed = item.createdAt
    ? (() => {
        const d = (Date.now() - new Date(item.createdAt)) / 1000 / 60;
        return d < 60 ? `${Math.round(d)}m ago` : d < 1440 ? `${Math.round(d / 60)}h ago` : 'Yesterday';
      })()
    : '';
  // id used for accept/decline = matchId (MentorMatch _id) if available, else subdoc _id
  const id = item.matchId || item._id;
  return {
    id, _id: id, name,
    grade: item.grade || item.student?.grade || 'Class ?',
    subject: item.subject || '—',
    time: elapsed,
    message: item.message || 'Requesting mentorship',
    avatar: initials,
    color: colors[idx], bg: bgs[idx],
  };
}

// ─── Time Slots ─────────────────────────────────────────────────────────────

const TIME_SLOTS = ['Mon 4–6 PM', 'Wed 5–7 PM', 'Sat 10–12 PM'];

// ─── Tab: Requests ────────────────────────────────────────────────────────────

function RequestsTab({ requests, setRequests, onAccept, onDecline }) {
  const [openSchedule, setOpenSchedule] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleAccept = (id) => {
    if (onAccept) onAccept(id);
    else setRequests(prev => prev.filter(r => r.id !== id));
  };
  const handleDecline = (id) => {
    if (onDecline) onDecline(id);
    else setRequests(prev => prev.filter(r => r.id !== id));
  };
  const toggleSchedule = (id) => {
    setOpenSchedule(prev => prev === id ? null : id);
    setSelectedSlot(null);
  };
  const handleConfirm = (id) => {
    handleAccept(id);
    setOpenSchedule(null);
    setSelectedSlot(null);
  };

  return (
    <div>
      {requests.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 16, padding: 64, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: 48 }}>🎉</p>
          <p style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginTop: 12 }}>All caught up!</p>
          <p style={{ color: '#64748B', fontSize: 15 }}>No pending mentorship requests.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {requests.map(r => (
            <div key={r.id} style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <Avatar initials={r.avatar} bg={r.bg} color={r.color} size={52} fontSize={16} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: '#0F172A' }}>{r.name}</p>
                    <span style={{ fontSize: 12, color: '#94A3B8' }}>{r.time}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 12, color: '#64748B', background: '#F8FAFC', padding: '3px 10px', borderRadius: 999, fontWeight: 500 }}>{r.grade}</span>
                    <SubjectBadge subject={r.subject} color={r.color} bg={r.bg} />
                  </div>
                  <div style={{ background: '#F8FAFC', borderLeft: `3px solid ${r.color}`, borderRadius: '0 8px 8px 0', padding: '12px 16px', marginBottom: 16 }}>
                    <p style={{ margin: 0, fontSize: 14, color: '#374151', fontStyle: 'italic' }}>"{r.message}"</p>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => handleAccept(r.id)} style={{ flex: 1, background: '#10b981', color: 'white', border: 'none', padding: '10px 0', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
                      ✓ Accept
                    </button>
                    <button onClick={() => toggleSchedule(r.id)} style={{ flex: 1.5, background: 'transparent', color: '#6c63ff', border: '2px solid #6c63ff', padding: '10px 0', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
                      📅 Schedule Session
                    </button>
                    <button onClick={() => handleDecline(r.id)} style={{ flex: 1, background: '#ef4444', color: 'white', border: 'none', padding: '10px 0', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
                      ✕ Decline
                    </button>
                  </div>
                </div>
              </div>

              {openSchedule === r.id && (
                <div style={{ marginTop: 16, padding: '16px 20px', background: '#f8f9ff', borderRadius: 12, border: '1px solid #e0e7ff' }}>
                  <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: '#374151' }}>Select a time slot:</p>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                    {TIME_SLOTS.map(slot => (
                      <button key={slot} onClick={() => setSelectedSlot(slot)}
                        style={{ padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                          background: selectedSlot === slot ? '#ede9fe' : 'white',
                          color: selectedSlot === slot ? '#6c63ff' : '#374151',
                          border: selectedSlot === slot ? '2px solid #6c63ff' : '1.5px solid #e2e8f0' }}>
                        {slot}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => selectedSlot && handleConfirm(r.id)}
                    style={{ padding: '10px 24px', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 14, fontFamily: 'inherit',
                      cursor: selectedSlot ? 'pointer' : 'not-allowed',
                      background: selectedSlot ? '#10b981' : '#d1d5db', color: 'white' }}>
                    ✓ Confirm Schedule
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab: My Students ─────────────────────────────────────────────────────────

function StudentsTab({ handleTabClick }) {
  const navigate = useNavigate();
  const [openSchedule, setOpenSchedule] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const toggleSchedule = (id) => {
    setOpenSchedule(prev => prev === id ? null : id);
    setSelectedSlot(null);
  };
  const handleConfirm = () => {
    setOpenSchedule(null);
    setSelectedSlot(null);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      {STUDENTS.map(s => (
        <div key={s.id} style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ position: 'relative' }}>
              <Avatar initials={s.avatar} bg={s.bg} color={s.color} size={52} fontSize={16} />
              {s.online && <div style={{ position: 'absolute', bottom: 2, right: 2, width: 13, height: 13, borderRadius: '50%', background: '#059669', border: '2px solid white' }} />}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: '#0F172A' }}>{s.name}</p>
              <p style={{ margin: '2px 0 4px', fontSize: 13, color: '#64748B' }}>{s.grade}</p>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                <SubjectBadge subject={s.subject} color={s.color} bg={s.bg} />
                {s.progress < 50 && (
                  <span style={{ background: '#fef3c7', color: '#d97706', borderRadius: '99px', fontSize: '11px', fontWeight: '700', padding: '3px 10px' }}>⚠️ Needs Attention</span>
                )}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: '#64748B' }}>Progress</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: s.progress >= 75 ? '#059669' : s.progress >= 50 ? '#D97706' : '#EF4444' }}>{s.progress}%</span>
            </div>
            <ProgressBar value={s.progress} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748B', marginBottom: 16 }}>
            <span>📚 {s.sessions} sessions completed</span>
            <span>🗓 {s.nextSession}</span>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => handleTabClick('Chats')} style={{ flex: 1, background: '#EFF6FF', color: '#2563EB', border: 'none', padding: '10px 0', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
              💬 Chat
            </button>
            <button onClick={() => toggleSchedule(s.id)} style={{ flex: 1, background: 'transparent', color: '#6c63ff', border: '2px solid #6c63ff', padding: '10px 0', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
              📅 Schedule
            </button>
            <button onClick={() => navigate(`/mentor/student/${s.id}`)} style={{ flex: 1, background: '#F5F3FF', color: '#7C3AED', border: 'none', padding: '10px 0', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
              📋 View Progress
            </button>
          </div>

          {openSchedule === s.id && (
            <div style={{ marginTop: 16, padding: '16px 20px', background: '#f8f9ff', borderRadius: 12, border: '1px solid #e0e7ff' }}>
              <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: '#374151' }}>Select a time slot:</p>
              <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                {TIME_SLOTS.map(slot => (
                  <button key={slot} onClick={() => setSelectedSlot(slot)}
                    style={{ padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                      background: selectedSlot === slot ? '#ede9fe' : 'white',
                      color: selectedSlot === slot ? '#6c63ff' : '#374151',
                      border: selectedSlot === slot ? '2px solid #6c63ff' : '1.5px solid #e2e8f0' }}>
                    {slot}
                  </button>
                ))}
              </div>
              <button onClick={() => selectedSlot && handleConfirm()}
                style={{ padding: '10px 24px', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 14, fontFamily: 'inherit',
                  cursor: selectedSlot ? 'pointer' : 'not-allowed',
                  background: selectedSlot ? '#10b981' : '#d1d5db', color: 'white' }}>
                ✓ Confirm Schedule
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Tab: Chats ───────────────────────────────────────────────────────────────

function ChatsTab({ onFocusChange, isFocused }) {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const endRef = useRef(null);
  const socketRef = useRef(null);
  const activeIdRef = useRef(null);
  const chatsRef = useRef([]);
  const mentorIdRef = useRef(null);
  const seenMessageIdsRef = useRef(new Set());

  const activeChat = chats.find(c => c.id === activeId);
  const mentorId = user?.id || user?._id;

  useEffect(() => {
    onFocusChange?.(Boolean(activeChat));
    return () => onFocusChange?.(false);
  }, [activeChat, onFocusChange]);

  // Build roomId for a given studentId
  const buildRoomId = (studentId) => {
    if (!mentorId || !studentId) return null;
    return `chat_${[mentorId.toString(), studentId.toString()].sort().join('_')}`;
  };

  const setLastSeenForRoom = (roomId, messageLike) => {
    if (!roomId) return;
    api.post(`/chat/${roomId}/read`, {
      userId: mentorIdRef.current,
      readAt: messageLike?.createdAt || null,
    }).catch(() => {});
    window.dispatchEvent(new Event('chat-lastseen-updated'));
  };

  const fetchChats = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await api.get('/mentors/my-students');
      const students = data.data || [];
      const mapped = students.map(s => ({
        id: s.studentId?.toString() || s._id?.toString(),
        studentId: s.studentId?.toString() || s._id?.toString(),
        name: s.studentName || 'Student',
        avatar: (s.studentName || 'S').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        bg: '#EFF6FF', color: '#2563EB',
        grade: s.grade || '',
        subject: s.subject || '',
        lastMsg: '', time: '', unread: 0, online: false,
      }));

      const hydrated = await Promise.all(mapped.map(async (chat) => {
        const roomId = buildRoomId(chat.studentId);
        if (!roomId) return chat;
        try {
          const [messagesRes, statusRes] = await Promise.all([
            fetch(`http://localhost:5000/api/chat/${roomId}`),
            api.get(`/chat/${roomId}/status`, { params: { userId: mentorId } }),
          ]);
          const roomMessages = await messagesRes.json();
          if (!Array.isArray(roomMessages) || roomMessages.length === 0) return chat;
          const lastMsgObj = roomMessages[roomMessages.length - 1];
          const unreadCount = statusRes.data?.unreadCount || 0;
          return {
            ...chat,
            lastMsg: lastMsgObj.text || '',
            time: formatMsgTime(lastMsgObj.createdAt),
            _ts: new Date(lastMsgObj.createdAt).getTime() || 0,
            unread: unreadCount,
          };
        } catch {
          return chat;
        }
      }));

      setChats([...hydrated].sort(sortByRecent));
    } catch {
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  // Keep refs in sync for stable socket closures
  useEffect(() => { activeIdRef.current = activeId; }, [activeId]);
  useEffect(() => { chatsRef.current = chats; }, [chats]);
  useEffect(() => { mentorIdRef.current = user?.id || user?._id; }, [user]);

  // Create socket once
  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    const onConnect = () => {
      const currentMentorId = mentorIdRef.current;
      if (currentMentorId) {
        socketRef.current?.emit('register-user', currentMentorId);
      }

      chatsRef.current.forEach((c) => {
        const rid = currentMentorId && c.studentId
          ? `chat_${[currentMentorId.toString(), c.studentId.toString()].sort().join('_')}`
          : null;
        if (rid) socketRef.current?.emit('joinRoom', rid);
      });
    };

    socketRef.current.on('connect', onConnect);

    return () => {
      socketRef.current?.off('connect', onConnect);
      socketRef.current?.disconnect();
    };
  }, []);

  // Fetch real accepted students
  useEffect(() => {
    fetchChats();
  }, [user]);

  useEffect(() => {
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, [user]);

  // Join ALL rooms once students are loaded so we receive messages for every chat
  useEffect(() => {
    if (!user || chats.length === 0) return;
    chats.forEach(c => {
      const rid = buildRoomId(c.studentId);
      if (rid) socketRef.current?.emit('joinRoom', rid);
    });
  }, [chats.length, user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Global socket listener — routes incoming messages to active chat window OR increments unread badge
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    const onAnyMessage = (msg) => {
      const msgId = msg?._id || `${msg?.roomId || ''}:${msg?.sender || ''}:${msg?.createdAt || ''}:${msg?.text || ''}`;
      if (seenMessageIdsRef.current.has(msgId)) return;
      seenMessageIdsRef.current.add(msgId);
      if (seenMessageIdsRef.current.size > 500) {
        const compact = Array.from(seenMessageIdsRef.current).slice(-300);
        seenMessageIdsRef.current = new Set(compact);
      }

      const aid = activeIdRef.current;
      const mid = mentorIdRef.current;
      if (!mid) return;

      localStorage.setItem('lastMessageTs_' + msg.roomId, String(new Date(msg.createdAt).getTime() || Date.now()));

      // Append to messages if this belongs to the active room
      const ac = chatsRef.current.find(c => c.id === aid);
      if (ac) {
        const rid = `chat_${[mid.toString(), ac.studentId.toString()].sort().join('_')}`;
        if (rid === msg.roomId) {
          setMessages(pm => [...pm, msg]);
          setLastSeenForRoom(rid, msg);
        }
      }

      // Update chat list preview + unread badge
      setChats(prev => prev.map(c => {
        if (!c.studentId) return c;
        const rid = `chat_${[mid.toString(), c.studentId.toString()].sort().join('_')}`;
        if (rid !== msg.roomId) return c;
        const incomingFromStudent = String(msg.sender) !== String(mid);
        return {
          ...c,
          lastMsg: msg.text,
          time: formatMsgTime(msg.createdAt),
          _ts: new Date(msg.createdAt).getTime() || Date.now(),
          unread: c.id === aid ? 0 : incomingFromStudent ? (c.unread || 0) + 1 : (c.unread || 0),
        };
      }).sort(sortByRecent));
    };
    socket.on('receiveMessage', onAnyMessage);
    socket.on('chat-message', onAnyMessage);
    return () => {
      socket.off('receiveMessage', onAnyMessage);
      socket.off('chat-message', onAnyMessage);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Join room + load messages when active chat changes
  useEffect(() => {
    if (!activeId || !user) return;
    const activeChat = chats.find(c => c.id === activeId);
    if (!activeChat) return;
    const roomId = buildRoomId(activeChat.studentId);
    if (!roomId) return;

    socketRef.current?.emit('joinRoom', roomId);

    fetch(`http://localhost:5000/api/chat/${roomId}`)
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) return;

        const last = data[data.length - 1];
        setLastSeenForRoom(roomId, last);

        // Merge: keep any real-time messages that arrived during the fetch
        setMessages(prev => {
          const historyIds = new Set(data.map(m => m._id?.toString()).filter(Boolean));
          const realtimeOnly = prev.filter(m => m._id && !historyIds.has(m._id.toString()));
          return [...data, ...realtimeOnly];
        });

        const lastMsgObj = data[data.length - 1];
        setChats(prev => prev.map(c => c.id === activeId
          ? {
              ...c,
              unread: 0,
              lastMsg: lastMsgObj?.text || c.lastMsg,
              time: lastMsgObj?.createdAt ? formatMsgTime(lastMsgObj.createdAt) : c.time,
              _ts: lastMsgObj?.createdAt ? new Date(lastMsgObj.createdAt).getTime() : (c._ts || 0),
            }
          : c).sort(sortByRecent));
      })
      .catch(() => {});
  }, [activeId, user, chats.length]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSelect = (chat) => {
    const roomId = buildRoomId(chat.studentId);
    if (roomId) {
      setLastSeenForRoom(roomId, null);
    }
    setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unread: 0 } : c));
    setActiveId(chat.id);
    setMessages([]);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || !activeId || !user) return;
    const activeChat = chats.find(c => c.id === activeId);
    if (!activeChat) return;
    const roomId = buildRoomId(activeChat.studentId);
    if (!roomId) return;
    socketRef.current?.emit('sendMessage', {
      roomId,
      sender: mentorId,
      senderRole: user.role,
      senderName: user.name,
      text,
    });
    setInput('');
  };

  const chatShellStyle = isFocused
    ? {
        background: 'white',
        borderRadius: 0,
        boxShadow: 'none',
        overflow: 'hidden',
        display: 'flex',
        height: 'calc(100vh - 88px)',
      }
    : {
        background: 'white',
        borderRadius: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        display: 'flex',
        height: '560px',
      };

  return (
    <div style={chatShellStyle}>

      {/* Left: chat list */}
      <div style={{ width: 280, borderRight: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid #F8FAFC' }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: '#0F172A' }}>Messages</p>
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <div style={{ padding: 24, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>Loading...</div>
          ) : chats.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
              <p style={{ fontSize: 32, marginBottom: 8 }}>💬</p>
              <p>No accepted students yet</p>
            </div>
          ) : chats.map(c => (
            <div key={c.id} onClick={() => handleSelect(c)}
              style={{ padding: '14px 16px', cursor: 'pointer', background: activeId === c.id ? '#EFF6FF' : 'white', borderBottom: '1px solid #F8FAFC', display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.15s' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <Avatar initials={c.avatar} bg={c.bg} color={c.color} size={42} />
                {c.online && <div style={{ position: 'absolute', bottom: 1, right: 1, width: 11, height: 11, borderRadius: '50%', background: '#059669', border: '2px solid white' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#0F172A' }}>{c.name}</p>
                  <span style={{ fontSize: 11, color: '#94A3B8', flexShrink: 0 }}>{c.time}</span>
                </div>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748B', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{c.lastMsg}</p>
              </div>
              {c.unread > 0 && (
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#059669', color: 'white', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {c.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right: chat window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!activeChat ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: '#94A3B8' }}>
            <span style={{ fontSize: 48 }}>💬</span>
            <p style={{ fontSize: 15 }}>Select a conversation</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative' }}>
                <Avatar initials={activeChat.avatar} bg={activeChat.bg} color={activeChat.color} size={38} />
                {activeChat.online && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 11, height: 11, borderRadius: '50%', background: '#059669', border: '2px solid white' }} />}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#0F172A' }}>{activeChat.name}</p>
                <p style={{ margin: 0, fontSize: 12, color: activeChat.online ? '#059669' : '#94A3B8' }}>{activeChat.online ? '● Online' : '○ Offline'}</p>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', color: '#94A3B8', marginTop: 40 }}>
                  <p style={{ fontSize: 28 }}>💬</p>
                  <p style={{ fontSize: 13 }}>No messages yet</p>
                </div>
              )}
              {messages.map(m => {
                const isMine = m.sender === (user?.id || user?._id);
                return (
                  <div key={m._id || m.createdAt} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '70%', padding: '10px 14px', borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background: isMine ? '#2563EB' : 'white',
                      color: isMine ? 'white' : '#374151',
                      fontSize: 14, lineHeight: 1.5,
                      boxShadow: !isMine ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    }}>
                      <p style={{ margin: '0 0 4px' }}>{m.text}</p>
                      <p style={{ margin: 0, fontSize: 11, opacity: 0.7, textAlign: 'right' }}>{formatMsgTime(m.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid #F1F5F9', display: 'flex', gap: 10 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Type a message..."
                style={{ flex: 1, padding: '10px 16px', border: '1.5px solid #E2E8F0', borderRadius: 24, fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#374151', background: '#F8FAFC' }}
              />
              <button onClick={handleSend}
                style={{ width: 42, height: 42, borderRadius: '50%', background: '#2563EB', color: 'white', border: 'none', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                ➤
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const TABS = [
  { key: 'Overview', label: '📊 Overview' },
  { key: 'Requests', label: '📩 Requests' },
  { key: 'My Students', label: '🎓 My Students' },
  { key: 'Chats', label: '💬 Chats' },
];

export default function MentorDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [isChatFocused, setIsChatFocused] = useState(false);
  const socketRef = useRef(null);

  const fetchRequests = useCallback(async () => {
    try {
      const { data } = await api.get('/mentors/incoming');
      const list = data.data || [];
      setRequests(list.map(transformMatch));
    } catch (e) { console.error('fetchRequests:', e); }
  }, []);

  // Initial fetch + poll every 10s
  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, [fetchRequests]);

  // Socket — register user + live-refresh when a student sends a request
  useEffect(() => {
    const socket = io('http://localhost:5000', { autoConnect: true });
    socketRef.current = socket;
    const userId = user?.id || user?._id;
    if (userId) {
      socket.on('connect', () => socket.emit('register-user', userId));
    }
    socket.on('mentorship-notification', (notif) => {
      if (notif.type === 'new-request') {
        fetchRequests(); // auto-refresh the list
      }
    });
    return () => socket.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?._id]);

  const handleAcceptRequest = async (matchId) => {
    try {
      await api.patch(`/mentors/request/${matchId}`, { status: 'active' });
      setRequests(prev => prev.filter(r => r.id !== matchId));
    } catch (e) { console.error(e); }
  };

  const handleDeclineRequest = async (matchId) => {
    try {
      await api.patch(`/mentors/request/${matchId}`, { status: 'closed' });
      setRequests(prev => prev.filter(r => r.id !== matchId));
    } catch (e) { console.error(e); }
  };

  const getTabFromURL = () => {
    const param = new URLSearchParams(location.search).get('tab');
    if (param === 'students') return 'My Students';
    if (param === 'requests') return 'Requests';
    if (param === 'chats') return 'Chats';
    return 'Overview';
  };

  const activeTab = getTabFromURL();
  const hideDashboardChrome = activeTab === 'Chats' && isChatFocused;
  const dashboardContentStyle = hideDashboardChrome
    ? { maxWidth: 'none', margin: 0, padding: 0 }
    : { maxWidth: 1100, margin: '0 auto', padding: '0 32px' };

  const handleTabClick = (tab) => {
    if (tab === 'Overview') navigate('/mentor-dashboard');
    else if (tab === 'My Students') navigate('/mentor-dashboard?tab=students');
    else if (tab === 'Requests') navigate('/mentor-dashboard?tab=requests');
    else if (tab === 'Chats') navigate('/mentor-dashboard?tab=chats');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: 88, paddingBottom: 64, fontFamily: 'Inter, sans-serif' }}>
      <div style={dashboardContentStyle}>

        {/* Header banner */}
        {!hideDashboardChrome && (
        <div style={{ background: 'linear-gradient(135deg, #059669, #0D9488)', borderRadius: 20, padding: '36px 40px', marginBottom: 28, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 14, opacity: 0.85, margin: '0 0 4px' }}>👋 Welcome back,</p>
            <p style={{ fontSize: 32, fontWeight: 800, margin: '0 0 4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {user?.name || 'Mentor'}
            </p>
            <p style={{ fontSize: 12, opacity: 0.65, margin: '0 0 6px', fontStyle: 'italic' }}>{user?.email}</p>
            <p style={{ fontSize: 14, opacity: 0.8, margin: 0 }}>You have {requests.length} pending request{requests.length !== 1 ? 's' : ''} waiting for your response.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: '20px 28px', textAlign: 'center' }}>
            <p style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>{STUDENTS.length}</p>
            <p style={{ fontSize: 13, opacity: 0.85, margin: '4px 0 0' }}>Students mentored</p>
          </div>
        </div>
        )}

        {/* Tab content */}
        {activeTab === 'Overview' && <OverviewTab requests={requests} handleTabClick={handleTabClick} />}
        {activeTab === 'Requests' && <RequestsTab requests={requests} setRequests={setRequests} onAccept={handleAcceptRequest} onDecline={handleDeclineRequest} />}
        {activeTab === 'My Students' && <StudentsTab handleTabClick={handleTabClick} />}
        {activeTab === 'Chats' && <ChatsTab onFocusChange={setIsChatFocused} isFocused={hideDashboardChrome} />}

      </div>
    </div>
  );
}

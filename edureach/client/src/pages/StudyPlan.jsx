import { useState } from 'react';
import api from '../services/api';

const PAGE_STYLE = {
  minHeight: '100vh',
  background: '#F8FAFC',
  paddingTop: '88px',
  paddingBottom: '64px',
  fontFamily: 'Inter, sans-serif',
};

const WRAP = {
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '0 32px',
};

const FIELD_INPUT = {
  width: '100%',
  padding: '12px 16px',
  border: '1.5px solid #E2E8F0',
  borderRadius: '10px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  background: '#F8FAFC',
};

const FIELD_LABEL = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '6px',
};

function getPriorityStyle(priority) {
  if (priority === 'high') return { background: '#FEE2E2', color: '#991B1B' };
  if (priority === 'low') return { background: '#DCFCE7', color: '#166534' };
  return { background: '#DBEAFE', color: '#1E40AF' };
}

export default function StudyPlan() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    grade: '',
    subjects: '',
    hoursPerDay: '',
    examDate: '',
    weakSubjects: '',
  });

  const handleGenerate = async () => {
    if (!form.grade || !form.subjects || !form.hoursPerDay) {
      setError('Please fill in Grade, Subjects and Hours per day.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/study-plan/generate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            grade: form.grade,
            subjects: form.subjects,
            hoursPerDay: form.hoursPerDay,
            examDate: form.examDate,
            weakSubjects: form.weakSubjects,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Server error');
      setPlan(data);
      api.post('/streak/badge', { badgeId: 'study_plan' }).catch(() => {});
      api.post('/activity', { icon: '📅', text: 'Generated Study Plan', type: 'studyplan' }).catch(() => {});
    } catch (err) {
      setError('Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div style={PAGE_STYLE}>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <div style={{ ...WRAP, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div
            style={{
              width: 48,
              height: 48,
              border: '4px solid #DBEAFE',
              borderTop: '4px solid #2563EB',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 24px',
            }}
          />
          <p style={{ fontSize: 16, color: '#64748B', textAlign: 'center', margin: '0 0 8px' }}>
            Claude AI is creating your personalized study plan...
          </p>
          <p style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', margin: 0 }}>
            This may take a few seconds
          </p>
        </div>
      </div>
    );
  }

  /* ─── No plan yet ─── */
  if (plan === null) {
    return (
      <div style={PAGE_STYLE}>
        <div style={WRAP}>
          <div
            style={{
              maxWidth: 600,
              margin: '0 auto',
              background: 'white',
              borderRadius: 20,
              padding: 48,
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            }}
          >
            <span style={{ fontSize: 48, textAlign: 'center', display: 'block' }}>✨</span>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                textAlign: 'center',
                color: '#0F172A',
                margin: '12px 0 0',
              }}
            >
              Generate Your AI Study Plan
            </h1>
            <p
              style={{
                fontSize: 15,
                color: '#64748B',
                textAlign: 'center',
                marginTop: 8,
                marginBottom: 32,
              }}
            >
              Tell us about yourself and Claude AI will create a personalized weekly study plan for you.
            </p>

            {/* Grade */}
            <div style={{ marginBottom: 20 }}>
              <label style={FIELD_LABEL}>Your Grade</label>
              <select
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                style={FIELD_INPUT}
              >
                <option value="">Select grade…</option>
                {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Subjects */}
            <div style={{ marginBottom: 20 }}>
              <label style={FIELD_LABEL}>Subjects (comma separated)</label>
              <input
                type="text"
                value={form.subjects}
                onChange={(e) => setForm({ ...form, subjects: e.target.value })}
                placeholder="Mathematics, Science, English, Social Science"
                style={FIELD_INPUT}
              />
            </div>

            {/* Hours */}
            <div style={{ marginBottom: 20 }}>
              <label style={FIELD_LABEL}>Hours available to study per day</label>
              <select
                value={form.hoursPerDay}
                onChange={(e) => setForm({ ...form, hoursPerDay: e.target.value })}
                style={FIELD_INPUT}
              >
                <option value="">Select hours…</option>
                {['1 hour', '2 hours', '3 hours', '4 hours', '5+ hours'].map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            {/* Exam date */}
            <div style={{ marginBottom: 20 }}>
              <label style={FIELD_LABEL}>Target Exam / Board Exam Date</label>
              <input
                type="date"
                value={form.examDate}
                onChange={(e) => setForm({ ...form, examDate: e.target.value })}
                style={FIELD_INPUT}
              />
            </div>

            {/* Weak subjects */}
            <div style={{ marginBottom: 20 }}>
              <label style={FIELD_LABEL}>Subjects you find difficult (optional)</label>
              <input
                type="text"
                value={form.weakSubjects}
                onChange={(e) => setForm({ ...form, weakSubjects: e.target.value })}
                placeholder="e.g. Mathematics, Chemistry"
                style={FIELD_INPUT}
              />
            </div>

            {error && (
              <div
                style={{
                  background: '#FFF1F2',
                  border: '1px solid #FECDD3',
                  color: '#BE123C',
                  padding: '12px 16px',
                  borderRadius: 10,
                  fontSize: 14,
                  marginBottom: 16,
                }}
              >
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                color: 'white',
                padding: '14px',
                borderRadius: 10,
                border: 'none',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: 8,
              }}
            >
              ✨ Generate My Study Plan
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Plan exists ─── */
  return (
    <div style={PAGE_STYLE}>
      <div style={WRAP}>

        {/* Header card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
            borderRadius: 20,
            padding: '32px 40px',
            marginBottom: 28,
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 24,
          }}
        >
          <div>
            <p style={{ fontSize: 13, opacity: 0.8, fontWeight: 600, margin: '0 0 6px' }}>
              ✨ Your AI Study Plan
            </p>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 6px' }}>
              {plan.studentGrade} — Personalized Weekly Plan
            </h1>
            <p style={{ fontSize: 14, opacity: 0.8, margin: 0 }}>
              {plan.totalWeeklyHours} hours/week across {plan.weeklySchedule?.length} days
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 14,
                padding: '20px 28px',
                textAlign: 'center',
                marginBottom: 12,
              }}
            >
              <p style={{ fontSize: 32, fontWeight: 800, margin: '0 0 4px' }}>
                {plan.examCountdown}
              </p>
              <p style={{ fontSize: 12, opacity: 0.8, margin: 0 }}>to exam</p>
            </div>
            <button
              onClick={() => setPlan(null)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 8,
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Regenerate Plan
            </button>
          </div>
        </div>

        {/* AI Tips */}
        <div
          style={{
            background: '#FFFBEB',
            border: '1px solid #FEF3C7',
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <p style={{ fontSize: 16, fontWeight: 700, color: '#92400E', margin: '0 0 12px' }}>
            💡 AI Tips for You
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {plan.aiTips?.map((tip, i) => (
              <li key={i} style={{ fontSize: 14, color: '#78350F', lineHeight: 1.8 }}>
                → {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Weekly Schedule */}
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#0F172A' }}>
          📅 Weekly Schedule
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 12,
            marginBottom: 28,
          }}
        >
          {plan.weeklySchedule?.map((dayObj) => (
            <div
              key={dayObj.day}
              style={{
                background: 'white',
                borderRadius: 14,
                padding: 16,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid #F1F5F9',
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 700, color: '#2563EB', margin: '0 0 8px' }}>
                {dayObj.day}
              </p>
              {dayObj.tasks?.map((task, i) => (
                <span
                  key={i}
                  style={{
                    ...getPriorityStyle(task.priority),
                    fontSize: 11,
                    padding: '4px 8px',
                    borderRadius: 6,
                    marginBottom: 4,
                    display: 'block',
                    fontWeight: 500,
                  }}
                >
                  {task.subject}: {task.duration}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Subject Priorities */}
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '28px 0 16px', color: '#0F172A' }}>
          📚 Subject Focus This Week
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}
        >
          {plan.subjectProgress?.map((subj) => (
            <div
              key={subj.subject}
              style={{
                background: 'white',
                borderRadius: 14,
                padding: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  {subj.subject}
                </p>
                <span
                  style={{
                    ...getPriorityStyle(subj.priority),
                    fontSize: 11,
                    padding: '3px 10px',
                    borderRadius: 999,
                    fontWeight: 600,
                  }}
                >
                  {subj.priority}
                </span>
              </div>
              <p style={{ fontSize: 14, color: '#64748B', margin: '8px 0 8px' }}>
                ⏱ {subj.weeklyHours} hrs/week
              </p>
              <p style={{ fontSize: 13, color: '#64748B', margin: 0, fontStyle: 'italic' }}>
                {subj.tips}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
 

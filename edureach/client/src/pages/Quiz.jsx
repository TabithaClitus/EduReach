import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const sampleQuizzes = [
  { id: 'demo-1', subject: 'Mathematics', topic: 'Quadratic Equations', questions: 10, duration: '15 min', difficulty: 'Medium', color: '#2563EB', bg: '#EFF6FF', icon: '📐' },
  { id: 'demo-2', subject: 'Science', topic: "Newton's Laws of Motion", questions: 10, duration: '15 min', difficulty: 'Easy', color: '#059669', bg: '#ECFDF5', icon: '🔬' },
  { id: 'demo-3', subject: 'English', topic: 'Grammar & Comprehension', questions: 10, duration: '15 min', difficulty: 'Easy', color: '#7C3AED', bg: '#F5F3FF', icon: '📝' },
];

function difficultyStyle(d) {
  if (d === 'Easy') return { background: '#DCFCE7', color: '#166534' };
  if (d === 'Hard') return { background: '#FEE2E2', color: '#991B1B' };
  return { background: '#FEF3C7', color: '#92400E' };
}

export default function Quiz() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F8FAFC',
        paddingTop: 88,
        paddingBottom: 64,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>

        {/* Header */}
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', margin: 0 }}>
          📝 Quizzes &amp; Tests
        </h1>
        <p style={{ fontSize: 16, color: '#64748B', marginTop: 8 }}>
          Test your knowledge after each lesson and track your progress
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 16, margin: '32px 0' }}>
          {[
            { value: '0', label: 'Quizzes Taken', color: '#2563EB' },
            { value: '0%', label: 'Average Score', color: '#059669' },
            { value: '0', label: 'Topics Mastered', color: '#7C3AED' },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: 'white',
                borderRadius: 14,
                padding: '20px 28px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                flex: 1,
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: 36, fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
              <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Available quizzes — empty state */}
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#0F172A' }}>
          Available Quizzes
        </h2>
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            padding: '64px 32px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <span style={{ fontSize: 64, display: 'block', marginBottom: 16 }}>📚</span>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: 0 }}>
            No Quizzes Available Yet
          </h3>
          <p
            style={{
              fontSize: 15,
              color: '#64748B',
              maxWidth: 480,
              margin: '12px auto 0',
              lineHeight: 1.6,
            }}
          >
            Quizzes will appear here once your courses are set up. Complete lessons in the Learning
            Hub to unlock topic quizzes.
          </p>
        </div>

        {/* Sample quizzes */}
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '32px 0 0', color: '#0F172A' }}>
          Sample Quiz — Try it out!
        </h2>
        <p style={{ fontSize: 14, color: '#64748B', margin: '8px 0 20px' }}>
          Practice with these demo quizzes while your courses load
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }}
        >
          {sampleQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              onClick={() => navigate('/quiz/' + quiz.id)}
              onMouseEnter={() => setHovered(quiz.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: 'white',
                borderRadius: 16,
                padding: 28,
                boxShadow: hovered === quiz.id
                  ? '0 8px 24px rgba(0,0,0,0.1)'
                  : '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid #F1F5F9',
                cursor: 'pointer',
                transform: hovered === quiz.id ? 'translateY(-2px)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: quiz.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 26,
                  }}
                >
                  {quiz.icon}
                </div>
                <span
                  style={{
                    ...difficultyStyle(quiz.difficulty),
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: 999,
                  }}
                >
                  {quiz.difficulty}
                </span>
              </div>

              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: quiz.color,
                  marginTop: 16,
                  marginBottom: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {quiz.subject}
              </p>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginTop: 4 }}>
                {quiz.topic}
              </p>

              <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#64748B', marginTop: 12 }}>
                <span>📋 {quiz.questions} questions</span>
                <span>⏱ {quiz.duration}</span>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); navigate('/quiz/' + quiz.id); }}
                style={{
                  marginTop: 20,
                  width: '100%',
                  padding: 11,
                  background: quiz.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Start Quiz →
              </button>
            </div>
          ))}
        </div>

        {/* Recent results */}
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '32px 0 16px', color: '#0F172A' }}>
          Recent Results
        </h2>
        <div style={{ textAlign: 'center', padding: 32, color: '#94A3B8', fontSize: 14 }}>
          Your quiz results will appear here
        </div>

      </div>
    </div>
  );
}

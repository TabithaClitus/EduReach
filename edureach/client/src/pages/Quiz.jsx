import { useNavigate } from 'react-router-dom';
import { QUIZ_DATA } from './QuizTake';

export default function Quiz() {
  const navigate = useNavigate();
  const quizzes = Object.entries(QUIZ_DATA);

  const icons = { Mathematics: '📐', Science: '🔬', English: '📖' };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F8FAFC',
        fontFamily: 'Inter, sans-serif',
        paddingTop: 40,
        paddingBottom: 60,
        paddingLeft: 24,
        paddingRight: 24,
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Practice Quizzes</h1>
        <p style={{ color: '#64748B', marginBottom: 32 }}>Test your knowledge and earn badges</p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: 24,
          }}
        >
          {quizzes.map(([id, quiz]) => (
            <div
              key={id}
              onClick={() => navigate(`/quiz/${id}`)}
              style={{
                background: quiz.bg || '#EFF6FF',
                border: `2px solid ${quiz.color}22`,
                borderRadius: 16,
                padding: '28px 24px',
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>
                {icons[quiz.subject] || '📝'}
              </div>
              <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 600, color: quiz.color, textTransform: 'uppercase', letterSpacing: 1 }}>
                {quiz.subject}
              </p>
              <h2 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 700, color: '#0F172A' }}>
                {quiz.topic}
              </h2>
              <p style={{ margin: '0 0 20px', fontSize: 13, color: '#64748B' }}>
                {quiz.questions.length} questions · 15 minutes
              </p>
              <button
                style={{
                  background: quiz.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 20px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Start Quiz →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

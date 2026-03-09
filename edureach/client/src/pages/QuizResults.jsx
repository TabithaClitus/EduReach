import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { QUIZ_DATA } from './QuizTake';

export default function QuizResults() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  if (!state) {
    navigate('/quiz');
    return null;
  }

  const { score, total, answers, subject, topic, color } = state;
  const quiz = QUIZ_DATA[id];
  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= 60;

  const getMessage = () => {
    if (percentage >= 90) return { title: 'Outstanding!', sub: 'You have an excellent grasp of this topic.' };
    if (percentage >= 60) return { title: 'Well Done!', sub: 'You passed. Keep reviewing to strengthen your knowledge.' };
    return { title: 'Keep Practicing', sub: "Don't give up! Review the material and try again." };
  };
  const msg = getMessage();

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
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Header card */}
        <div
          style={{
            background: 'white',
            borderRadius: 20,
            padding: '40px 48px',
            textAlign: 'center',
            boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
            marginBottom: 28,
          }}
        >
          <p style={{ margin: '0 0 4px', fontSize: 13, color: '#64748B' }}>{subject}</p>
          <h1 style={{ margin: '0 0 32px', fontSize: 22, fontWeight: 700, color: '#0F172A' }}>{topic}</h1>

          {/* Score circle */}
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: '50%',
              border: `8px solid ${passed ? '#059669' : '#EF4444'}`,
              margin: '0 auto 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 42,
                fontWeight: 800,
                color: passed ? '#059669' : '#EF4444',
                lineHeight: 1,
              }}
            >
              {percentage}%
            </p>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: '#64748B' }}>
              {score}/{total} correct
            </p>
          </div>

          {/* Badge */}
          <span
            style={{
              display: 'inline-block',
              padding: '6px 20px',
              borderRadius: 999,
              background: passed ? '#DCFCE7' : '#FEE2E2',
              color: passed ? '#059669' : '#EF4444',
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 12,
            }}
          >
            {passed ? '✓ PASSED' : '✗ FAILED'}
          </span>

          <p style={{ margin: 0, color: '#374151', fontSize: 15 }}>
            <strong>{msg.title}</strong> {msg.sub}
          </p>
        </div>

        {/* Action buttons */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 32,
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => navigate('/study-plan')}
            style={{
              flex: 1,
              padding: '14px 0',
              borderRadius: 10,
              border: '1px solid #E2E8F0',
              background: 'white',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
              color: '#374151',
              fontFamily: 'inherit',
              minWidth: 160,
            }}
          >
            📚 Study Plan
          </button>
          <button
            onClick={() => navigate('/quiz/' + id)}
            style={{
              flex: 1,
              padding: '14px 0',
              borderRadius: 10,
              border: '1px solid #2563EB',
              background: '#EFF6FF',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
              color: '#2563EB',
              fontFamily: 'inherit',
              minWidth: 160,
            }}
          >
            🔄 Retake Quiz
          </button>
          <button
            onClick={() => navigate('/quiz')}
            style={{
              flex: 1,
              padding: '14px 0',
              borderRadius: 10,
              border: 'none',
              background: '#2563EB',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
              color: 'white',
              fontFamily: 'inherit',
              minWidth: 160,
            }}
          >
            ← All Quizzes
          </button>
        </div>

        {/* Answers review */}
        <div
          style={{
            background: 'white',
            borderRadius: 20,
            boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '24px 32px',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0F172A' }}>Answer Review</h2>
            <span style={{ fontSize: 13, color: '#64748B' }}>
              {score} correct · {total - score} wrong
            </span>
          </div>

          <div style={{ padding: '8px 0' }}>
            {answers.map((ans, idx) => {
              const q = quiz ? quiz.questions[idx] : null;
              return (
                <div
                  key={idx}
                  style={{
                    padding: '20px 32px',
                    borderBottom: idx < answers.length - 1 ? '1px solid #F8FAFC' : 'none',
                    background: ans.isCorrect ? '#F0FDF4' : '#FFF5F5',
                    borderLeft: `4px solid ${ans.isCorrect ? '#059669' : '#EF4444'}`,
                    marginBottom: 2,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#374151' }}>
                      Q{idx + 1}. {q ? q.question : `Question ${idx + 1}`}
                    </p>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: ans.isCorrect ? '#059669' : '#EF4444',
                        flexShrink: 0,
                        marginLeft: 12,
                      }}
                    >
                      {ans.isCorrect ? '✓ Correct' : '✗ Wrong'}
                    </span>
                  </div>
                  {q && (
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, color: '#64748B' }}>
                        Your answer:{' '}
                        <strong style={{ color: ans.isCorrect ? '#059669' : '#EF4444' }}>
                          {ans.selected !== undefined ? q.options[ans.selected] : 'Not answered'}
                        </strong>
                      </span>
                      {!ans.isCorrect && (
                        <span style={{ fontSize: 13, color: '#64748B' }}>
                          Correct:{' '}
                          <strong style={{ color: '#059669' }}>{q.options[q.correct]}</strong>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

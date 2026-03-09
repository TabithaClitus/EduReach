import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const QUIZ_DATA = {
  'demo-1': {
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    color: '#2563EB',
    bg: '#EFF6FF',
    questions: [
      { id: 1, question: 'What is the standard form of a quadratic equation?', options: ['ax + b = 0', 'ax² + bx + c = 0', 'ax³ + bx² + c = 0', 'ax² + b = 0'], correct: 1 },
      { id: 2, question: 'What is the discriminant of ax² + bx + c = 0?', options: ['b² - 4ac', 'b² + 4ac', '4ac - b²', 'b - 4ac'], correct: 0 },
      { id: 3, question: 'How many roots does a quadratic equation have?', options: ['1', '2', '3', '4'], correct: 1 },
      { id: 4, question: 'If discriminant > 0, the roots are:', options: ['Equal', 'Complex', 'Real and distinct', 'Zero'], correct: 2 },
      { id: 5, question: 'Solve: x² - 5x + 6 = 0. What are the roots?', options: ['x = 1, 6', 'x = 2, 3', 'x = -2, -3', 'x = 1, -6'], correct: 1 },
      { id: 6, question: 'The sum of roots of ax² + bx + c = 0 is:', options: ['b/a', '-b/a', 'c/a', '-c/a'], correct: 1 },
      { id: 7, question: 'The product of roots of ax² + bx + c = 0 is:', options: ['b/a', '-b/a', 'c/a', '-c/a'], correct: 2 },
      { id: 8, question: 'Which method cannot be used to solve quadratic equations?', options: ['Factoring', 'Quadratic formula', 'Integration', 'Completing the square'], correct: 2 },
      { id: 9, question: 'If roots are equal, discriminant equals:', options: ['1', '-1', '0', '2'], correct: 2 },
      { id: 10, question: 'Solve: x² - 4 = 0', options: ['x = 4', 'x = ±2', 'x = 2', 'x = -4'], correct: 1 },
    ],
  },
  'demo-2': {
    subject: 'Science',
    topic: "Newton's Laws of Motion",
    color: '#059669',
    bg: '#ECFDF5',
    questions: [
      { id: 1, question: "Newton's First Law is also called:", options: ['Law of Acceleration', 'Law of Inertia', 'Law of Action-Reaction', 'Law of Gravity'], correct: 1 },
      { id: 2, question: 'Force equals:', options: ['mass × velocity', 'mass × acceleration', 'mass × distance', 'velocity × time'], correct: 1 },
      { id: 3, question: "Newton's Third Law states:", options: ['F=ma', 'Objects at rest stay at rest', 'Every action has equal and opposite reaction', 'Force is proportional to mass'], correct: 2 },
      { id: 4, question: 'The SI unit of force is:', options: ['Joule', 'Watt', 'Newton', 'Pascal'], correct: 2 },
      { id: 5, question: 'Inertia depends on:', options: ['Volume', 'Speed', 'Mass', 'Temperature'], correct: 2 },
      { id: 6, question: 'A ball rolling on a surface slows due to:', options: ['Gravity', 'Friction', 'Inertia', 'Mass'], correct: 1 },
      { id: 7, question: 'If net force is zero, object:', options: ['Accelerates', 'Decelerates', 'Remains in same state', 'Stops immediately'], correct: 2 },
      { id: 8, question: 'Mass of 10kg, acceleration 2m/s². Force is:', options: ['5N', '12N', '20N', '8N'], correct: 2 },
      { id: 9, question: 'When rocket expels gas backward, it moves:', options: ['Downward', 'Forward', 'Backward', 'Stays still'], correct: 1 },
      { id: 10, question: 'Which has more inertia?', options: ['Feather', 'Cricket ball', 'Table tennis ball', 'Balloon'], correct: 1 },
    ],
  },
  'demo-3': {
    subject: 'English',
    topic: 'Grammar & Comprehension',
    color: '#7C3AED',
    bg: '#F5F3FF',
    questions: [
      { id: 1, question: 'Which is a noun?', options: ['Run', 'Happy', 'Mountain', 'Quickly'], correct: 2 },
      { id: 2, question: 'She ___ to school every day. (correct verb)', options: ['go', 'goes', 'going', 'gone'], correct: 1 },
      { id: 3, question: 'The opposite of "ancient" is:', options: ['Old', 'Modern', 'Historic', 'Antique'], correct: 1 },
      { id: 4, question: "Which sentence is correct?", options: ["He don't like it", "He doesn't likes it", "He doesn't like it", 'He not like it'], correct: 2 },
      { id: 5, question: '"The sun rises in the east." The subject is:', options: ['rises', 'east', 'sun', 'the'], correct: 2 },
      { id: 6, question: 'A word that describes a noun is called:', options: ['Verb', 'Adverb', 'Adjective', 'Pronoun'], correct: 2 },
      { id: 7, question: 'Plural of "child" is:', options: ['Childs', 'Childes', 'Children', 'Childrens'], correct: 2 },
      { id: 8, question: '"Quickly" is an example of:', options: ['Adjective', 'Adverb', 'Noun', 'Verb'], correct: 1 },
      { id: 9, question: 'Past tense of "write" is:', options: ['Writed', 'Written', 'Wrote', 'Writes'], correct: 2 },
      { id: 10, question: 'Which punctuation ends a question?', options: ['.', '!', '?', ','], correct: 2 },
    ],
  },
};

export { QUIZ_DATA };

export default function QuizTake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quiz = QUIZ_DATA[id];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({});
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const timerRef = useRef(null);

  const handleSubmit = () => {
    clearInterval(timerRef.current);
    const answers = quiz.questions.map((q, idx) => ({
      questionId: idx,
      selected: selected[idx],
      correct: q.correct,
      isCorrect: selected[idx] === q.correct,
    }));
    const score = answers.filter((a) => a.isCorrect).length;
    navigate('/quiz/results/' + id, {
      state: {
        score,
        total: quiz.questions.length,
        answers,
        subject: quiz.subject,
        topic: quiz.topic,
        color: quiz.color,
      },
    });
  };

  useEffect(() => {
    if (!quiz) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (!quiz) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <p style={{ fontSize: 20, color: '#64748B' }}>Quiz not found</p>
        <button
          onClick={() => navigate('/quiz')}
          style={{
            padding: '10px 24px',
            background: '#2563EB',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          ← Back to Quizzes
        </button>
      </div>
    );
  }

  const total = quiz.questions.length;
  const q = quiz.questions[current];
  const timerRed = timeLeft < 60;
  const timerOrange = timeLeft < 180;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#F8FAFC',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          background: 'white',
          borderBottom: '1px solid #F1F5F9',
          padding: '0 32px',
          height: 68,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => {
              if (window.confirm('Quit quiz? Progress will be lost')) navigate(-1);
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748B',
              fontSize: 14,
              fontWeight: 500,
              padding: 0,
            }}
          >
            ← Back
          </button>
          <div style={{ marginLeft: 16 }}>
            <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>{quiz.subject}</p>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{quiz.topic}</p>
          </div>
        </div>

        <p style={{ fontWeight: 600, fontSize: 15, color: '#374151', margin: 0 }}>
          Question {current + 1} of {total}
        </p>

        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: timerRed ? '#EF4444' : timerOrange ? '#F59E0B' : '#0F172A',
            background: timerRed ? '#FEE2E2' : '#F8FAFC',
            padding: '8px 16px',
            borderRadius: 8,
          }}
        >
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: '#F1F5F9', height: 4, flexShrink: 0 }}>
        <div
          style={{
            background: quiz.color,
            height: '100%',
            width: `${((current + 1) / total) * 100}%`,
            transition: 'width 0.3s',
          }}
        />
      </div>

      {/* Question area */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: 20,
            padding: 48,
            maxWidth: 680,
            width: '100%',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}
        >
          <span
            style={{
              background: quiz.bg,
              color: quiz.color,
              fontSize: 12,
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: 999,
              display: 'inline-block',
              marginBottom: 20,
            }}
          >
            Q{current + 1}
          </span>

          <p
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: '#0F172A',
              lineHeight: 1.5,
              marginBottom: 32,
              marginTop: 0,
            }}
          >
            {q.question}
          </p>

          {q.options.map((opt, i) => {
            const isSel = selected[current] === i;
            return (
              <button
                key={i}
                onClick={() => setSelected({ ...selected, [current]: i })}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '16px 20px',
                  marginBottom: 12,
                  borderRadius: 12,
                  textAlign: 'left',
                  fontSize: 15,
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'all 0.15s',
                  border: isSel ? `2px solid ${quiz.color}` : '2px solid #E2E8F0',
                  background: isSel ? quiz.bg : 'white',
                  color: isSel ? quiz.color : '#374151',
                  fontFamily: 'inherit',
                }}
              >
                {['A', 'B', 'C', 'D'][i]}. {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          background: 'white',
          borderTop: '1px solid #F1F5F9',
          padding: '16px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        {/* Previous */}
        <div>
          {current > 0 && (
            <button
              onClick={() => setCurrent((c) => c - 1)}
              style={{
                border: '1px solid #E2E8F0',
                background: 'white',
                padding: '10px 24px',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 14,
                fontFamily: 'inherit',
              }}
            >
              ← Previous
            </button>
          )}
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {quiz.questions.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                margin: '0 3px',
                cursor: 'pointer',
                background: selected[i] !== undefined ? quiz.color : '#E2E8F0',
              }}
            />
          ))}
        </div>

        {/* Next / Submit */}
        <div>
          {current < total - 1 ? (
            <button
              onClick={() => setCurrent((c) => c + 1)}
              disabled={selected[current] === undefined}
              style={{
                background: selected[current] !== undefined ? '#2563EB' : '#CBD5E1',
                color: 'white',
                border: 'none',
                padding: '10px 24px',
                borderRadius: 8,
                cursor: selected[current] !== undefined ? 'pointer' : 'not-allowed',
                fontWeight: 600,
                fontSize: 14,
                fontFamily: 'inherit',
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              style={{
                background: '#059669',
                color: 'white',
                border: 'none',
                padding: '10px 24px',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 14,
                fontFamily: 'inherit',
              }}
            >
              Submit ({Object.keys(selected).length}/{total} answered)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';

const todayTasksData = [
  { id: 1, subject: 'Mathematics', topic: 'Quadratic Equations — Chapter 4', duration: '45 min', done: true, color: '#2563EB' },
  { id: 2, subject: 'Science', topic: "Newton's Laws of Motion", duration: '30 min', done: true, color: '#059669' },
  { id: 3, subject: 'English', topic: 'Essay Writing Practice', duration: '20 min', done: true, color: '#7C3AED' },
  { id: 4, subject: 'Social Science', topic: 'Indian Independence Movement', duration: '40 min', done: false, color: '#D97706' },
  { id: 5, subject: 'Mathematics', topic: 'Practice Problems — Set B', duration: '30 min', done: false, color: '#2563EB' },
];

const weekDays = [
  { day: 'Mon', date: '3', subjects: ['Maths', 'Science'], hours: '3h', isToday: false },
  { day: 'Tue', date: '4', subjects: ['English', 'SST'], hours: '2.5h', isToday: false },
  { day: 'Wed', date: '5', subjects: ['Maths', 'CS'], hours: '3h', isToday: false },
  { day: 'Thu', date: '6', subjects: ['Science', 'English'], hours: '2h', isToday: true },
  { day: 'Fri', date: '7', subjects: ['Maths', 'SST'], hours: '3.5h', isToday: false },
  { day: 'Sat', date: '8', subjects: ['Revision'], hours: '4h', isToday: false },
  { day: 'Sun', date: '9', subjects: ['Rest 😴'], hours: '0h', isToday: false },
];

const subjects = [
  { name: 'Mathematics', progress: 72, hoursThisWeek: 8.5, nextTopic: 'Trigonometry', color: '#2563EB', bg: '#EFF6FF', icon: '📐' },
  { name: 'Science', progress: 58, hoursThisWeek: 6, nextTopic: 'Electricity', color: '#059669', bg: '#ECFDF5', icon: '🔬' },
  { name: 'English', progress: 85, hoursThisWeek: 4, nextTopic: 'Letter Writing', color: '#7C3AED', bg: '#F5F3FF', icon: '📝' },
  { name: 'Social Science', progress: 45, hoursThisWeek: 5, nextTopic: 'World War II', color: '#D97706', bg: '#FFFBEB', icon: '🌍' },
  { name: 'Computer Science', progress: 90, hoursThisWeek: 3, nextTopic: 'Python Lists', color: '#0891B2', bg: '#ECFEFF', icon: '💻' },
  { name: 'Hindi', progress: 60, hoursThisWeek: 3.5, nextTopic: 'Kabir ke Dohe', color: '#E11D48', bg: '#FFF1F2', icon: '📖' },
];

const StudyPlan = () => {
  const [tasks, setTasks] = useState(todayTasksData);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const doneCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;
  const progressPct = Math.round((doneCount / totalCount) * 100);

  return (
    <div
      style={{
        paddingTop: 88,
        background: '#F8FAFC',
        minHeight: '100vh',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 32px 64px',
        }}
      >
        {/* SECTION 1: HEADER */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
            borderRadius: 20,
            padding: 40,
            marginBottom: 32,
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 32,
            flexWrap: 'wrap',
          }}
        >
          {/* Left side */}
          <div style={{ flex: 1, minWidth: 260 }}>
            <p style={{ fontSize: 14, opacity: 0.8, margin: '0 0 6px' }}>
              Good morning! 👋
            </p>
            <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 8px' }}>
              Your Study Plan
            </h1>
            <p style={{ fontSize: 15, opacity: 0.8, marginTop: 8, marginBottom: 28 }}>
              Stay consistent — small steps lead to big results.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
                { icon: '📚', label: '5 Subjects' },
                { icon: '⏱️', label: '3.5 hrs today' },
                { icon: '🔥', label: '7 day streak' },
              ].map((badge) => (
                <div
                  key={badge.label}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: 10,
                    padding: '12px 20px',
                    fontSize: 14,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span>{badge.icon}</span>
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side — Exam countdown */}
          <div
            style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 16,
              padding: 24,
              textAlign: 'center',
              minWidth: 180,
            }}
          >
            <p style={{ fontSize: 13, opacity: 0.8, margin: '0 0 8px' }}>
              Board Exams
            </p>
            <p style={{ fontSize: 56, fontWeight: 800, margin: '0 0 4px', lineHeight: 1 }}>
              45
            </p>
            <p style={{ fontSize: 13, opacity: 0.8, margin: '0 0 16px' }}>
              days remaining
            </p>
            <div
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.2)',
                height: 6,
                borderRadius: 3,
              }}
            >
              <div
                style={{
                  width: '40%',
                  height: '100%',
                  borderRadius: 3,
                  background: 'white',
                }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: TODAY'S TASKS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: 24,
          }}
        >
          {/* Left — Today's Tasks */}
          <div
            style={{
              background: 'white',
              borderRadius: 16,
              padding: 28,
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
                Today's Tasks
              </h2>
              <span
                style={{
                  background: '#D1FAE5',
                  color: '#059669',
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: 20,
                }}
              >
                {doneCount} of {totalCount} done
              </span>
            </div>

            {tasks.map((task, idx) => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '14px 0',
                  borderBottom: idx < tasks.length - 1 ? '1px solid #F1F5F9' : 'none',
                }}
              >
                {/* Checkbox */}
                <div
                  onClick={() => toggleTask(task.id)}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    flexShrink: 0,
                    cursor: 'pointer',
                    background: task.done ? '#10B981' : 'white',
                    border: task.done ? 'none' : '2px solid #CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    color: 'white',
                    fontWeight: 700,
                    transition: 'all 0.2s',
                  }}
                >
                  {task.done && '✓'}
                </div>

                {/* Color bar */}
                <div
                  style={{
                    width: 4,
                    height: 40,
                    borderRadius: 2,
                    background: task.color,
                    flexShrink: 0,
                  }}
                />

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: task.color,
                      textTransform: 'uppercase',
                      margin: '0 0 4px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {task.subject}
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      margin: 0,
                      color: task.done ? '#94A3B8' : '#0F172A',
                      textDecoration: task.done ? 'line-through' : 'none',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {task.topic}
                  </p>
                </div>

                {/* Duration badge */}
                <span
                  style={{
                    fontSize: 12,
                    background: '#F1F5F9',
                    padding: '4px 10px',
                    borderRadius: 6,
                    color: '#64748B',
                    flexShrink: 0,
                    fontWeight: 500,
                  }}
                >
                  {task.duration}
                </span>
              </div>
            ))}
          </div>

          {/* Right — Today's Progress */}
          <div
            style={{
              background: 'white',
              borderRadius: 16,
              padding: 28,
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                margin: '0 0 24px',
                alignSelf: 'flex-start',
              }}
            >
              Today's Progress
            </h2>

            {/* Circular progress */}
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: '50%',
                background: `conic-gradient(#2563EB ${progressPct * 3.6}deg, #F1F5F9 0deg)`,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: '50%',
                  background: 'white',
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: '#2563EB',
                    lineHeight: 1,
                  }}
                >
                  {progressPct}%
                </span>
              </div>
            </div>

            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#0F172A',
                margin: '0 0 20px',
                textAlign: 'center',
              }}
            >
              {doneCount} of {totalCount} tasks done
            </p>

            <div
              style={{
                width: '100%',
                background: '#F8FAFC',
                borderRadius: 12,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 13,
                  color: '#374151',
                }}
              >
                <span style={{ opacity: 0.7 }}>Time studied today</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>1h 35min</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 13,
                  color: '#374151',
                }}
              >
                <span style={{ opacity: 0.7 }}>Est. remaining</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>1h 10min</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: WEEKLY SCHEDULE */}
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            padding: 28,
            marginTop: 24,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px' }}>
            Weekly Schedule
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 12,
            }}
          >
            {weekDays.map((d) => (
              <div
                key={d.day}
                style={{
                  textAlign: 'center',
                  padding: '16px 8px',
                  borderRadius: 12,
                  cursor: 'pointer',
                  background: d.isToday ? '#2563EB' : '#F8FAFC',
                  color: d.isToday ? 'white' : '#374151',
                  border: d.isToday ? 'none' : '1px solid #F1F5F9',
                  boxShadow: d.isToday ? '0 4px 12px rgba(37,99,235,0.3)' : 'none',
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    margin: '0 0 4px',
                    opacity: d.isToday ? 1 : 0.6,
                  }}
                >
                  {d.day}
                </p>
                <p
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    margin: '4px 0',
                    lineHeight: 1,
                  }}
                >
                  {d.date}
                </p>
                <div style={{ margin: '8px 0 4px', display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
                  {d.subjects.map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: 10,
                        background: d.isToday ? 'rgba(255,255,255,0.2)' : 'rgba(37,99,235,0.08)',
                        color: d.isToday ? 'white' : '#2563EB',
                        padding: '2px 6px',
                        borderRadius: 6,
                        fontWeight: 600,
                        display: 'block',
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p
                  style={{
                    fontSize: 11,
                    opacity: 0.7,
                    margin: '4px 0 0',
                    fontWeight: 600,
                  }}
                >
                  {d.hours}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: SUBJECT PROGRESS */}
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            margin: '32px 0 16px',
            color: '#0F172A',
          }}
        >
          Subject Progress
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }}
        >
          {subjects.map((subject) => (
            <div
              key={subject.name}
              style={{
                background: 'white',
                borderRadius: 16,
                padding: 24,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
            >
              {/* Icon + Name */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: subject.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {subject.icon}
                </div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    margin: 0,
                    color: '#0F172A',
                  }}
                >
                  {subject.name}
                </h3>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  background: '#F1F5F9',
                  height: 8,
                  borderRadius: 4,
                  marginBottom: 10,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${subject.progress}%`,
                    height: '100%',
                    borderRadius: 4,
                    background: subject.color,
                  }}
                />
              </div>

              <p style={{ fontSize: 13, color: '#374151', margin: '0 0 10px' }}>
                <span style={{ fontWeight: 700, color: subject.color }}>
                  {subject.progress}%
                </span>{' '}
                completed
              </p>

              <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 6px' }}>
                ⏱ {subject.hoursThisWeek} hrs this week
              </p>

              <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>
                Next:{' '}
                <span style={{ fontWeight: 600, color: '#374151' }}>
                  {subject.nextTopic}
                </span>
              </p>
            </div>
          ))}
        </div>

        {/* SECTION 5: GENERATE PLAN BUTTON */}
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button
            onClick={() => alert('AI Study Plan generator coming soon!')}
            style={{
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              color: 'white',
              padding: '16px 48px',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
            }}
          >
            ✨ Generate New AI Study Plan
          </button>
          <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 12 }}>
            Powered by AI — personalized for your grade, subjects and exam schedule
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudyPlan;

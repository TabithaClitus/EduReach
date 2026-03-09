const generateStudyPlan = async (req, res) => {
  try {
    const { grade, subjects, hoursPerDay, examDate, weakSubjects } = req.body;

    if (!grade || !subjects || !hoursPerDay) {
      return res.status(400).json({ error: 'grade, subjects and hoursPerDay are required.' });
    }

    const subjectList = subjects.split(',').map((s) => s.trim());

    const prompt = `You are an expert Indian school education planner.
Create a weekly study plan for a ${grade} student.

Student details:
- Subjects: ${subjectList.join(', ')}
- Daily study hours: ${hoursPerDay}
- Exam date: ${examDate || 'in 3 months'}
- Weak subjects: ${weakSubjects || 'none'}

IMPORTANT: Include ALL ${subjectList.length} subjects: ${subjectList.join(', ')}
Distribute them across all 7 days based on importance and difficulty.

Return ONLY a JSON object with NO markdown formatting, NO backticks, just raw JSON:
{
  "studentGrade": "${grade}",
  "totalWeeklyHours": ${Number(hoursPerDay.replace(/[^0-9.]/g, '')) * 7},
  "examCountdown": "days until exam",
  "weeklySchedule": [
    { "day": "Monday", "tasks": [
      { "subject": "SUBJECT_NAME", "topic": "specific topic", "duration": "X min", "priority": "high/medium/low" }
    ]},
    { "day": "Tuesday", "tasks": [] },
    { "day": "Wednesday", "tasks": [] },
    { "day": "Thursday", "tasks": [] },
    { "day": "Friday", "tasks": [] },
    { "day": "Saturday", "tasks": [] },
    { "day": "Sunday", "tasks": [] }
  ],
  "subjectProgress": [
    { "subject": "SUBJECT_NAME", "weeklyHours": 0, "priority": "high/medium/low", "tips": "specific tip" }
  ],
  "aiTips": [
    "tip 1", "tip 2", "tip 3", "tip 4"
  ]
}

Include one entry in subjectProgress for EACH of these subjects: ${subjectList.join(', ')}
Make sure EVERY subject appears in the weeklySchedule across different days.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 3000,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Groq error' });
    }

    const text = data.choices?.[0]?.message?.content || '';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { generateStudyPlan };

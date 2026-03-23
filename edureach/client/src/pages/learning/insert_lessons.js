const fs = require('fs');
const file = fs.readFileSync('LessonPage.jsx', 'utf8');
const lines = file.split('\n');
const insertIndex = lines.findIndex(l => l.includes('CLASS 6 – ENGLISH – POETRY'));
if (insertIndex === -1) { console.error('Not found'); process.exit(1); }
const payload = fs.readFileSync('temp_lessons.jsx', 'utf8');
lines.splice(insertIndex - 1, 0, payload);
fs.writeFileSync('LessonPage.jsx', lines.join('\n'));
console.log('Inserted at index', insertIndex);

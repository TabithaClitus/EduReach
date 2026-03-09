const http = require('http');
const d = JSON.stringify({ prompt: 'say hi in one word' });
const req = http.request(
  {
    hostname: 'localhost',
    port: 5000,
    path: '/api/study-plan/generate',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': d.length },
  },
  (res) => {
    let b = '';
    res.on('data', (c) => (b += c));
    res.on('end', () => console.log('STATUS:', res.statusCode, '\nBODY:', b));
  }
);
req.on('error', (e) => console.error('ERROR:', e.message));
req.write(d);
req.end();

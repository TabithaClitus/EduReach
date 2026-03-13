import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function formatTime(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MentoringChat() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id || user?._id;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [mentorName, setMentorName] = useState('');
  const [roomId, setRoomId] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Connect socket once
  useEffect(() => {
    const socket = io('http://localhost:5000');
    socketRef.current = socket;
    return () => socket.disconnect();
  }, []);

  // Fetch accepted mentor, build roomId
  useEffect(() => {
    if (!userId) return;
    api.get('/mentors/my-request')
      .then(({ data }) => {
        if (data.mentorshipStatus === 'accepted' && data.myMentor) {
          const mentorId = (data.myMentor._id || data.myMentor).toString();
          setMentorName(data.myMentor.name || 'Mentor');
          const rid = `chat_${[mentorId, userId.toString()].sort().join('_')}`;
          setRoomId(rid);
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [userId]);

  // Join room, load history, listen for messages
  useEffect(() => {
    if (!roomId) return;

    // Mark conversation as read when chat opens
    localStorage.setItem('lastSeen_' + roomId, Date.now().toString());
    window.dispatchEvent(new Event('chat-lastseen-updated'));

    fetch(`http://localhost:5000/api/chat/${roomId}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMessages(prev => {
            const historyIds = new Set(data.map(m => m._id?.toString()).filter(Boolean));
            const realtimeOnly = prev.filter(m => m._id && !historyIds.has(m._id.toString()));
            return [...data, ...realtimeOnly];
          });
        }
        setLoading(false);
      })
      .catch(() => { setLoading(false); });

    socketRef.current?.emit('joinRoom', roomId);

    const onMessage = (msg) => {
      setMessages(prev => [...prev, msg]);
      localStorage.setItem('lastSeen_' + roomId, Date.now().toString());
      window.dispatchEvent(new Event('chat-lastseen-updated'));
    };
    socketRef.current?.on('receiveMessage', onMessage);
    return () => socketRef.current?.off('receiveMessage', onMessage);
  }, [roomId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    if (!input.trim() || !roomId || !userId) return;
    socketRef.current?.emit('sendMessage', {
      roomId,
      sender: userId,
      senderRole: user.role,
      senderName: user.name,
      text: input.trim(),
    });
    setInput('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  const initials = mentorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  if (loading) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#F8FAFC', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '68px' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid #2563EB', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!roomId) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#F8FAFC', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', paddingTop: '68px' }}>
        <div style={{ fontSize: '64px' }}>🎓</div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', margin: 0 }}>No active mentorship</h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>You need an accepted mentor to chat</p>
        <button onClick={() => navigate('/mentoring')} style={{ padding: '10px 24px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
          Find a Mentor
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#F8FAFC', zIndex: 50, display: 'flex', flexDirection: 'column', paddingTop: '68px' }}>
      <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

        {/* HEADER */}
        <div style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
          <button
            onClick={() => navigate('/mentoring', { state: { tab: 'chat' } })}
            style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F1F5F9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#475569', flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.background = '#E2E8F0'}
            onMouseLeave={e => e.currentTarget.style.background = '#F1F5F9'}
          >←</button>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#DBEAFE', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: '16px', color: '#0F172A', marginBottom: '3px' }}>{mentorName}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
              <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 500 }}>Active</span>
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        <div style={{ flex: 1, overflowY: 'scroll', padding: '24px', background: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#94A3B8', marginTop: 60 }}>
              <p style={{ fontSize: 36, marginBottom: 8 }}>💬</p>
              <p style={{ fontSize: 14 }}>No messages yet. Start the conversation!</p>
            </div>
          )}
          {messages.map((msg) => {
            const isMine = msg.sender === userId || msg.sender?._id?.toString() === userId?.toString();
            return (
              <div key={msg._id || msg.createdAt} style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                {!isMine && msg.senderName && (
                  <span style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '2px', paddingLeft: '4px' }}>{msg.senderName}</span>
                )}
                <div style={{
                  maxWidth: '65%', padding: '12px 16px',
                  borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: isMine ? '#2563EB' : '#fff',
                  color: isMine ? '#fff' : '#0F172A',
                  border: isMine ? 'none' : '1px solid #E2E8F0',
                  fontSize: '14px', lineHeight: '1.5',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }}>
                  {msg.text}
                </div>
                <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', paddingLeft: '4px', paddingRight: '4px' }}>
                  {formatTime(msg.createdAt)}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div style={{ background: '#fff', borderTop: '1px solid #E2E8F0', padding: '16px 24px', display: 'flex', gap: '12px', alignItems: 'center', flexShrink: 0 }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            style={{ flex: 1, padding: '12px 16px', fontSize: '14px', border: '1px solid #E2E8F0', borderRadius: '24px', outline: 'none', background: '#F8FAFC', color: '#0F172A' }}
            onFocus={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.background = '#fff'; }}
            onBlur={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8FAFC'; }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            style={{ width: '44px', height: '44px', borderRadius: '50%', background: input.trim() ? '#2563EB' : '#E2E8F0', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s', fontSize: '18px' }}
            onMouseEnter={e => { if (input.trim()) e.currentTarget.style.background = '#1D4ED8'; }}
            onMouseLeave={e => { if (input.trim()) e.currentTarget.style.background = '#2563EB'; }}
          >
            <span style={{ color: input.trim() ? '#fff' : '#94A3B8', lineHeight: 1, marginLeft: '2px' }}>➤</span>
          </button>
        </div>

      </div>
    </div>
  );
}

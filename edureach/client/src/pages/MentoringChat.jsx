import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const socket = io('http://localhost:5000');

const MENTOR_ID = 'mentor1'; // hardcoded until real mentor IDs are wired

function formatTime(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MentoringChat() {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const roomId = 'chat_test_room_1'; // hardcoded for testing

  useEffect(() => {
    socket.emit('joinRoom', roomId);

    fetch(`http://localhost:5000/api/chat/${roomId}`)
      .then(r => r.json())
      .then(data => setMessages(Array.isArray(data) ? data : []))
      .catch(() => setMessages([]));

    const onMessage = (msg) => setMessages(prev => [...prev, msg]);
    socket.on('receiveMessage', onMessage);

    return () => {
      socket.off('receiveMessage', onMessage);
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    if (!input.trim() || !user) return;
    socket.emit('sendMessage', {
      roomId,
      sender: user._id,
      senderRole: user.role,
      senderName: user.name,
      text: input.trim(),
    });
    setInput('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#F8FAFC', zIndex: 50, display: 'flex', flexDirection: 'column', paddingTop: '68px' }}>
      <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

        {/* ── HEADER ── */}
        <div style={{
          background: '#fff',
          borderBottom: '1px solid #E2E8F0',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          flexShrink: 0,
        }}>
          <button
            onClick={() => navigate('/mentoring', { state: { tab: 'chat' } })}
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: '#F1F5F9', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', color: '#475569', flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#E2E8F0'}
            onMouseLeave={e => e.currentTarget.style.background = '#F1F5F9'}
          >
            ←
          </button>

          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: '#DBEAFE', color: '#2563EB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', fontWeight: 700, flexShrink: 0,
          }}>
            AS
          </div>

          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: '16px', color: '#0F172A', marginBottom: '3px' }}>
              Arjun Sharma
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
              <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 500 }}>Online</span>
            </div>
          </div>

          <div style={{
            padding: '6px 14px', background: '#EFF6FF',
            borderRadius: '20px', border: '1px solid #BFDBFE',
            fontSize: '13px', fontWeight: 600, color: '#2563EB', flexShrink: 0,
          }}>
            12 Sessions
          </div>
        </div>

        {/* ── MESSAGES ── */}
        <div style={{
          flex: 1,
          overflowY: 'scroll',
          padding: '24px',
          background: '#F8FAFC',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#94A3B8', marginTop: 60 }}>
              <p style={{ fontSize: 36, marginBottom: 8 }}>💬</p>
              <p style={{ fontSize: 14 }}>No messages yet. Start the conversation!</p>
            </div>
          )}
          {messages.map((msg) => {
            const isMine = msg.sender === user?._id;
            return (
              <div
                key={msg._id || msg.createdAt}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMine ? 'flex-end' : 'flex-start',
                }}
              >
                {!isMine && msg.senderName && (
                  <span style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '2px', paddingLeft: '4px' }}>
                    {msg.senderName}
                  </span>
                )}
                <div style={{
                  maxWidth: '65%',
                  padding: '12px 16px',
                  borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: isMine ? '#2563EB' : '#fff',
                  color: isMine ? '#fff' : '#0F172A',
                  border: isMine ? 'none' : '1px solid #E2E8F0',
                  fontSize: '14px',
                  lineHeight: '1.5',
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

        {/* ── INPUT ── */}
        <div style={{
          background: '#fff',
          borderTop: '1px solid #E2E8F0',
          padding: '16px 24px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: '14px',
              border: '1px solid #E2E8F0',
              borderRadius: '24px',
              outline: 'none',
              background: '#F8FAFC',
              color: '#0F172A',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.background = '#fff'; }}
            onBlur={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8FAFC'; }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: input.trim() ? '#2563EB' : '#E2E8F0',
              border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'background 0.15s',
              fontSize: '18px',
            }}
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

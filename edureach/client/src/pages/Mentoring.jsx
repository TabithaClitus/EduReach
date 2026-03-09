import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Users, MessageCircle, Star, Send } from 'lucide-react';
import api from '../services/api';
import useAuthStore from '../store/authStore';

const SUBJECTS = [
  'Mathematics', 'Science', 'English', 'Hindi', 'History',
  'Geography', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
];

const LANG_LABELS = { en: 'English', hi: 'Hindi', ta: 'Tamil', te: 'Telugu', kn: 'Kannada', ml: 'Malayalam' };

// ── Components ──────────────────────────────────────────

function Stars({ value = 0, interactive = false, onChange, size = 14 }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={interactive ? () => onChange(i) : undefined}
          style={{ background: 'none', border: 'none', padding: 0, cursor: interactive ? 'pointer' : 'default', lineHeight: 1 }}
        >
          <Star style={{ width: size, height: size, color: i <= value ? '#F59E0B' : '#E5E7EB', fill: i <= value ? '#F59E0B' : '#E5E7EB' }} />
        </button>
      ))}
    </div>
  );
}

function AvatarCircle({ name = 'U', size = 40 }) {
  const initials = (name || 'U').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: '#EFF6FF', color: '#2563EB',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: Math.max(10, Math.floor(size * 0.38)), flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function MentorCard({ mentor, onRequest, requesting, isStudent, onRequestMentor }) {
  const u = mentor.user || {};
  return (
    <div style={{
      background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0',
      padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'}
    >
      {/* Top section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Avatar + Name + Rating */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, color: '#2563EB', flexShrink: 0 }}>
            {u.name ? u.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : '?'}
          </div>
          <div>
            <p style={{ fontWeight: 600, color: '#0F172A', fontSize: '15px', marginBottom: '4px' }}>{u.name}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Stars value={mentor.rating || 0} />
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                {(mentor.rating || 0).toFixed(1)} · {mentor.totalSessions || 0} sessions
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {mentor.bio && (
          <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {mentor.bio}
          </p>
        )}

        {/* Subjects */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {(mentor.subjects || []).map((s) => (
            <span key={s} style={{ padding: '3px 10px', background: '#EFF6FF', color: '#2563EB', fontSize: '12px', fontWeight: 500, borderRadius: '20px' }}>
              {s}
            </span>
          ))}
        </div>

        {/* Languages */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {(mentor.languages || []).map((l) => (
            <span key={l} style={{ padding: '3px 10px', background: '#F1F5F9', color: '#475569', fontSize: '12px', fontWeight: 500, borderRadius: '20px' }}>
              {LANG_LABELS[l] || l.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Request button */}
      {isStudent && (
        <button
          onClick={() => onRequest(mentor)}
          disabled={requesting}
          style={{
            width: '100%', padding: '10px', background: requesting ? '#93C5FD' : '#2563EB',
            color: '#fff', fontSize: '14px', fontWeight: 600, borderRadius: '8px',
            border: 'none', cursor: requesting ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { if (!requesting) e.currentTarget.style.background = '#1D4ED8'; }}
          onMouseLeave={e => { if (!requesting) e.currentTarget.style.background = '#2563EB'; }}
        >
          {requesting
            ? <span style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
            : 'Request Mentor'}
        </button>
      )}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────

export default function Mentoring() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const isStudent = user?.role === 'student';
  const isMentor = user?.role === 'mentor';

  const [tab, setTab] = useState('discover');
  const [hasMentor, setHasMentor] = useState(true);
  const [hasChats, setHasChats] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (location.state?.tab === 'chat') {
      setTab('chat');
    }
  }, [location.state]);

  const sampleChats = [
    { id: 1, mentorName: 'Arjun Sharma', lastMessage: 'See you tomorrow at 5pm!', time: '2:30 PM', unread: 2, initials: 'AS' },
    { id: 2, mentorName: 'Priya Nair', lastMessage: 'Great work on that problem set!', time: 'Yesterday', unread: 0, initials: 'PN' },
  ];

  const sampleActiveMentor = {
    name: 'Arjun Sharma',
    subjects: ['Mathematics', 'Physics'],
    languages: ['Hindi', 'English'],
    rating: 4.8,
    sessionsCompleted: 12,
    bio: 'IIT Bombay graduate with 5 years teaching experience in Maths and Physics.',
  };

  // Discover
  const [mentors, setMentors] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState('');
  const [langFilter, setLangFilter] = useState('');
  const [loadingMentors, setLoadingMentors] = useState(false);
  const [requestingId, setRequestingId] = useState(null);

  // Requests
  const [outgoing, setOutgoing] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [respondingId, setRespondingId] = useState(null);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Chat
  const [activeMatches, setActiveMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [typingUser, setTypingUser] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Rating modal
  const [ratingMatch, setRatingMatch] = useState(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  // Socket init
  useEffect(() => {
    socketRef.current = io('http://localhost:5000', { autoConnect: true });
    return () => socketRef.current?.disconnect();
  }, []);

  // Fetch on tab change
  useEffect(() => {
    if (tab === 'discover') fetchMentors();
    if (tab === 'requests') {
      if (isStudent) fetchOutgoing();
      if (isMentor) fetchIncoming();
    }
    if (tab === 'chat') fetchActiveMatches();
  }, [tab, subjectFilter, langFilter]);

  // Socket room + listeners for selected match
  useEffect(() => {
    if (!selectedMatch) return;
    const socket = socketRef.current;
    socket.emit('join-room', selectedMatch._id);
    const onMsg = (msg) => setMessages((prev) => [...prev, msg]);
    const onTyping = (name) => setTypingUser(name);
    const onStopTyping = () => setTypingUser('');
    socket.on('new-message', onMsg);
    socket.on('typing', onTyping);
    socket.on('stop-typing', onStopTyping);
    return () => {
      socket.off('new-message', onMsg);
      socket.off('typing', onTyping);
      socket.off('stop-typing', onStopTyping);
    };
  }, [selectedMatch]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function fetchMentors() {
    setLoadingMentors(true);
    try {
      const params = {};
      if (subjectFilter) params.subject = subjectFilter;
      if (langFilter) params.language = langFilter;
      const { data } = await api.get('/mentors', { params });
      setMentors(data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoadingMentors(false); }
  }

  async function fetchOutgoing() {
    setLoadingRequests(true);
    try {
      const { data } = await api.get('/mentors/my-requests');
      setOutgoing(data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoadingRequests(false); }
  }

  async function fetchIncoming() {
    setLoadingRequests(true);
    try {
      const { data } = await api.get('/mentors/incoming');
      setIncoming(data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoadingRequests(false); }
  }

  async function fetchActiveMatches() {
    try {
      const { data } = await api.get('/mentors/active-matches');
      setActiveMatches(data.data || []);
    } catch (e) { console.error(e); }
  }

  async function fetchMessages(matchId) {
    try {
      const { data } = await api.get(`/mentors/messages/${matchId}`);
      setMessages(data.data || []);
    } catch (e) { console.error(e); }
  }

  const handleRequestMentor = (mentorId, mentorName) => {
    alert(`Request sent to ${mentorName}! They will respond shortly.`);
  };

  async function handleRequest(mentor) {
    setRequestingId(mentor._id);
    try {
      await api.post('/mentors/request', {
        mentorUserId: mentor.user._id,
        subject: mentor.subjects?.[0] || '',
      });
      alert('Request sent! The mentor will be notified.');
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to send request.');
    } finally { setRequestingId(null); }
  }

  async function handleRespond(matchId, status) {
    setRespondingId(matchId);
    try {
      await api.patch(`/mentors/request/${matchId}`, { status });
      fetchIncoming();
    } catch (e) { console.error(e); }
    finally { setRespondingId(null); }
  }

  function handleSelectMatch(match) {
    setSelectedMatch(match);
    fetchMessages(match._id);
  }

  function handleSend() {
    if (!newMsg.trim() || !selectedMatch) return;
    socketRef.current.emit('send-message', {
      matchId: selectedMatch._id,
      senderId: user._id,
      content: newMsg.trim(),
    });
    setNewMsg('');
    socketRef.current.emit('stop-typing', selectedMatch._id);
  }

  function handleTypingChange(val) {
    setNewMsg(val);
    if (!selectedMatch) return;
    socketRef.current.emit('typing', { matchId: selectedMatch._id, userName: user.name });
    clearTimeout(window.__typingTimer);
    window.__typingTimer = setTimeout(() => {
      socketRef.current.emit('stop-typing', selectedMatch._id);
    }, 2000);
  }

  async function handleSubmitRating() {
    setSubmittingRating(true);
    try {
      await api.post(`/mentors/rate/${ratingMatch._id}`, { rating: ratingValue, feedback });
      setRatingMatch(null);
      setFeedback('');
      setSelectedMatch(null);
      fetchActiveMatches();
    } catch (e) { console.error(e); }
    finally { setSubmittingRating(false); }
  }

  const getOther = (match) =>
    user?._id === match.student?._id ? match.mentor : match.student;

  const tabs = [
    { id: 'discover', label: 'Discover Mentors' },
    { id: 'requests', label: isStudent ? 'My Requests' : 'My Mentor' },
    { id: 'chat', label: 'Active Chats' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: '68px' }}>

      {/* ── Page Header Band ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '28px 0 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', letterSpacing: '-0.3px' }}>
            Mentoring
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '24px' }}>
            Connect with mentors who understand your journey
          </p>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '4px', width: 'fit-content', marginBottom: '20px' }}>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: '8px 20px',
                  fontSize: '13px',
                  fontWeight: 500,
                  borderRadius: '7px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  background: tab === t.id ? '#2563EB' : 'transparent',
                  color: tab === t.id ? '#fff' : '#64748B',
                  boxShadow: tab === t.id ? '0 1px 4px rgba(37,99,235,0.3)' : 'none',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Filters — only on discover tab */}
          {tab === 'discover' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                style={{ padding: '8px 14px', fontSize: '13px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#fff', color: '#374151', outline: 'none', cursor: 'pointer' }}
              >
                <option value="">All Subjects</option>
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={langFilter}
                onChange={(e) => setLangFilter(e.target.value)}
                style={{ padding: '8px 14px', fontSize: '13px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#fff', color: '#374151', outline: 'none', cursor: 'pointer' }}
              >
                <option value="">All Languages</option>
                {Object.entries(LANG_LABELS).map(([code, label]) => (
                  <option key={code} value={code}>{label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* ── Page Content ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>

        {/* ── DISCOVER ── */}
        {tab === 'discover' && (
          <>
            {loadingMentors ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0' }}>
                <div style={{ width: '32px', height: '32px', border: '2px solid #2563EB', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : mentors.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#94A3B8' }}>
                <Users style={{ width: '48px', height: '48px', margin: '0 auto 12px', opacity: 0.3 }} />
                <p style={{ fontWeight: 500, color: '#64748B', marginBottom: '4px' }}>No mentors found</p>
                <p style={{ fontSize: '13px' }}>Try clearing the filters</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {mentors.map((m) => (
                  <MentorCard
                    key={m._id}
                    mentor={m}
                    onRequest={handleRequest}
                    requesting={requestingId === m._id}
                    isStudent={isStudent}
                    onRequestMentor={handleRequestMentor}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── MY MENTOR ── */}
        {tab === 'requests' && (
          <div>
            {!hasMentor ? (
              /* STATE 1 — No active mentor */
              <div style={{ textAlign: 'center', padding: '80px 40px' }}>
                <div style={{ fontSize: '64px', marginBottom: '20px', lineHeight: 1 }}>🎓</div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                  You don't have a mentor yet
                </h2>
                <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '28px' }}>
                  Browse mentors and send a request to get started
                </p>
                <button
                  onClick={() => setTab('discover')}
                  style={{ padding: '10px 24px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                >
                  Find a Mentor
                </button>
              </div>
            ) : (
              /* STATE 2 — Has active mentor */
              <div style={{ maxWidth: '560px' }}>
                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

                  {/* Avatar + Name + Rating */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, color: '#2563EB', flexShrink: 0 }}>
                      {sampleActiveMentor.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                          {sampleActiveMentor.name}
                        </h3>
                        <span style={{ padding: '2px 10px', background: '#D1FAE5', color: '#065F46', fontSize: '11px', fontWeight: 600, borderRadius: '20px' }}>Active</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Stars value={Math.round(sampleActiveMentor.rating)} />
                        <span style={{ fontSize: '13px', color: '#64748B' }}>{sampleActiveMentor.rating} rating</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', marginBottom: '20px' }}>
                    {sampleActiveMentor.bio}
                  </p>

                  {/* Sessions stat */}
                  <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '22px', fontWeight: 700, color: '#2563EB' }}>{sampleActiveMentor.sessionsCompleted}</span>
                    <span style={{ fontSize: '13px', color: '#64748B' }}>Sessions with you</span>
                  </div>

                  {/* Subjects */}
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Subjects</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {sampleActiveMentor.subjects.map(s => (
                        <span key={s} style={{ padding: '4px 12px', background: '#EFF6FF', color: '#2563EB', fontSize: '12px', fontWeight: 500, borderRadius: '20px' }}>{s}</span>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div style={{ marginBottom: '28px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Languages</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {sampleActiveMentor.languages.map(l => (
                        <span key={l} style={{ padding: '4px 12px', background: '#F1F5F9', color: '#475569', fontSize: '12px', fontWeight: 500, borderRadius: '20px' }}>{l}</span>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => navigate('/mentoring/chat/1')}
                      style={{ flex: 1, padding: '11px', background: '#059669', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                    >
                      💬 Open Chat
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to end your mentorship with ' + sampleActiveMentor.name + '?')) {
                          alert('Mentorship ended');
                          setHasMentor(false);
                        }
                      }}
                      style={{ flex: 1, padding: '11px', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                    >
                      End Mentorship
                    </button>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CHAT ── */}
        {tab === 'chat' && (
          <div style={{ display: 'flex', height: '600px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #F1F5F9', overflow: 'hidden', margin: '0 0 32px 0' }}>

            {/* ── LEFT PANEL ── */}
            <div style={{ width: '360px', flexShrink: 0, borderRight: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column' }}>
              {/* Header + search */}
              <div style={{ padding: '20px', borderBottom: '1px solid #F1F5F9' }}>
                <p style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', margin: '0 0 12px 0' }}>Messages</p>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  style={{ width: '100%', padding: '10px 16px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#374151' }}
                />
              </div>
              {/* Chat rows */}
              <div style={{ overflowY: 'auto', flex: 1 }}>
                {sampleChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    onMouseEnter={e => { if (selectedChat?.id !== chat.id) e.currentTarget.style.background = '#F8FAFC'; }}
                    onMouseLeave={e => { if (selectedChat?.id !== chat.id) e.currentTarget.style.background = '#fff'; }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '14px 20px', cursor: 'pointer',
                      background: selectedChat?.id === chat.id ? '#EFF6FF' : '#fff',
                      borderLeft: selectedChat?.id === chat.id ? '3px solid #2563EB' : '3px solid transparent',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, color: '#2563EB', flexShrink: 0 }}>
                      {chat.initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px', color: '#0F172A' }}>{chat.mentorName}</span>
                        <span style={{ fontSize: '12px', color: '#94A3B8', flexShrink: 0, marginLeft: '8px' }}>{chat.time}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#64748B', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {chat.lastMessage}
                      </p>
                    </div>
                    {chat.unread > 0 && (
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#EF4444', color: '#fff', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {chat.unread}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {!selectedChat ? (
                /* Empty state */
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '64px', lineHeight: 1 }}>💬</div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Select a conversation</h3>
                  <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>Click on a chat to start messaging</p>
                </div>
              ) : (
                <>
                  {/* Chat header */}
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 700, color: '#2563EB', flexShrink: 0 }}>
                        {selectedChat.initials}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '16px', color: '#0F172A', margin: '0 0 3px 0' }}>{selectedChat.mentorName}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                          <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 500 }}>Active now</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/mentoring/chat/' + selectedChat.id)}
                      onMouseEnter={e => e.currentTarget.style.background = '#1D4ED8'}
                      onMouseLeave={e => e.currentTarget.style.background = '#2563EB'}
                      style={{ background: '#2563EB', color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}
                    >
                      Open Chat →
                    </button>
                  </div>

                  {/* Messages preview */}
                  <div style={{ flex: 1, padding: '24px', overflowY: 'auto', background: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { sender: 'mentor', text: 'See you tomorrow at 5pm!', time: '2:30 PM' },
                      { sender: 'student', text: 'Sure sir! Will prepare the problems.', time: '2:28 PM' },
                      { sender: 'mentor', text: 'Great! Focus on Chapter 4.', time: '2:25 PM' },
                    ].map((msg, i) => {
                      const isStudent = msg.sender === 'student';
                      return (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: isStudent ? 'flex-end' : 'flex-start' }}>
                          <div style={{
                            maxWidth: '65%', padding: '10px 14px',
                            borderRadius: isStudent ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                            background: isStudent ? '#2563EB' : '#fff',
                            color: isStudent ? '#fff' : '#0F172A',
                            border: isStudent ? 'none' : '1px solid #E2E8F0',
                            fontSize: '14px', lineHeight: '1.5',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                          }}>
                            {msg.text}
                          </div>
                          <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', padding: '0 4px' }}>{msg.time}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick reply bar */}
                  <div style={{ padding: '16px 24px', borderTop: '1px solid #F1F5F9', background: '#fff', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Quick reply..."
                      style={{ flex: 1, padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', outline: 'none', color: '#374151' }}
                    />
                    <button
                      onClick={() => navigate('/mentoring/chat/' + selectedChat.id)}
                      onMouseEnter={e => e.currentTarget.style.background = '#1D4ED8'}
                      onMouseLeave={e => e.currentTarget.style.background = '#2563EB'}
                      style={{ background: '#2563EB', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 20px', fontWeight: 600, cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap' }}
                    >
                      Open Chat →
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        )}
      </div>

      {/* ── Rating Modal ── */}
      {ratingMatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Rate your mentor</h3>
            <p className="text-sm text-gray-500 mb-5">
              How was your experience with {getOther(ratingMatch)?.name}?
            </p>
            <div className="flex justify-center mb-5">
              <Stars value={ratingValue} interactive onChange={setRatingValue} />
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write feedback (optional)…"
              rows={3}
              className="w-full text-sm border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setRatingMatch(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={submittingRating}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition-colors"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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

function MentorCard({ mentor, onRequest, requesting, requested, isStudent, onRequestMentor }) {
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
            <p style={{ fontWeight: 600, color: '#0F172A', fontSize: '15px', marginBottom: '2px' }}>{u.name}</p>
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
          onClick={() => !requested && onRequest(mentor)}
          disabled={requesting || requested}
          style={{
            width: '100%', padding: '10px',
            background: requested ? '#E2E8F0' : requesting ? '#93C5FD' : '#2563EB',
            color: requested ? '#64748B' : '#fff', fontSize: '14px', fontWeight: 600, borderRadius: '8px',
            border: 'none', cursor: (requesting || requested) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { if (!requesting && !requested) e.currentTarget.style.background = '#1D4ED8'; }}
          onMouseLeave={e => { if (!requesting && !requested) e.currentTarget.style.background = '#2563EB'; }}
        >
          {requested
            ? '✓ Requested'
            : requesting
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

  // Discover
  const [mentors, setMentors] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState('');
  const [langFilter, setLangFilter] = useState('');
  const [loadingMentors, setLoadingMentors] = useState(false);
  const [requestingId, setRequestingId] = useState(null);
  const [requestedIds, setRequestedIds] = useState(new Set());

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

  // Socket init — also listens for mentorship notifications (student gets live status update)
  useEffect(() => {
    const socket = io('http://localhost:5000', { autoConnect: true });
    socketRef.current = socket;

    const userId = user?.id || user?._id;
    if (userId) {
      socket.on('connect', () => socket.emit('register-user', userId));
    }

    // If mentor responds → refresh outgoing list so status badge updates instantly
    socket.on('mentorship-notification', (notif) => {
      if (notif.type === 'request-response') {
        fetchOutgoing();
      }
    });

    return () => socket.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?._id]);

  // Fetch on tab change
  useEffect(() => {
    if (tab === 'discover') {
      fetchMentors();
      if (isStudent) fetchOutgoing();
    }
    if (tab === 'requests') {
      if (isStudent) fetchOutgoing();
      if (isMentor) fetchIncoming();
    }
    if (tab === 'chat') fetchActiveMatches();
  }, [tab, subjectFilter, langFilter]);

  // Poll every 10s while on the My Requests tab (student) so status updates live
  useEffect(() => {
    if (tab !== 'requests' || !isStudent) return;
    const interval = setInterval(fetchOutgoing, 10000);
    return () => clearInterval(interval);
  }, [tab, isStudent]);

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
      const { data } = await api.get('/mentors/list', { params });
      console.log('[Mentoring] fetchMentors returned', data.data?.length, 'mentors:', data.data?.map(m => ({ id: m._id, userId: m.user?._id, name: m.user?.name })));
      setMentors(data.data || []);
    } catch (e) { console.error('[Mentoring] fetchMentors error:', e); }
    finally { setLoadingMentors(false); }
  }

  async function fetchOutgoing() {
    setLoadingRequests(true);
    try {
      // Get the student's current status from the User model
      const { data } = await api.get('/mentors/my-request');
      const status = data.mentorshipStatus || 'none';
      const requestedMentorId = data.requestedMentorId?._id || data.requestedMentorId || null;

      if (status === 'pending' && requestedMentorId) {
        // Mark only that mentor's card as "✓ Requested"
        setRequestedIds(new Set([requestedMentorId.toString()]));
      } else {
        // none / declined → all buttons active so student can request again
        setRequestedIds(new Set());
      }

      // Also fetch the MentorMatch list for the My Requests tab display
      const listResp = await api.get('/mentors/my-requests');
      setOutgoing(listResp.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoadingRequests(false); }
  }

  async function fetchIncoming() {
    setLoadingRequests(true);
    try {
      const { data } = await api.get('/mentors/incoming');
      // Backend now returns User-embedded requests array (pending only)
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
    if (!user) {
      navigate('/');
      return;
    }
    setRequestingId(mentor._id);
    try {
      await api.post('/mentors/request', {
        mentorUserId: mentor.user._id,
        subject: mentor.subjects?.[0] || '',
      });
      // Mark ONLY this mentor's card as requested
      setRequestedIds(new Set([mentor.user._id.toString()]));
      api.post('/streak/badge', { badgeId: 'first_mentor' }).catch(() => {});
      api.post('/activity', { icon: '🤝', text: 'Mentor request sent', type: 'mentor' }).catch(() => {});
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to send request.');
    } finally { setRequestingId(null); }
  }

  async function handleRespond(matchId, status) {
    setRespondingId(matchId);
    try {
      await api.patch(`/mentors/request/${matchId}`, { status });
      // Remove from incoming list immediately
      setIncoming(prev => prev.filter(m => m._id !== matchId));
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || 'Failed to respond.');
    } finally { setRespondingId(null); }
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
    { id: 'discover', label: '\uD83D\uDD0D Discover Mentors' },
    { id: 'requests', label: isStudent ? '\uD83D\uDCCB My Requests' : '\uD83D\uDCE9 Incoming Requests' },
    { id: 'chat', label: '\uD83D\uDCAC Active Chats' },
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
                    requested={isStudent && requestedIds.has(m.user?._id)}
                    isStudent={isStudent}
                    onRequestMentor={handleRequestMentor}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── MY REQUESTS (student) / INCOMING (mentor) ── */}
        {tab === 'requests' && (
          <div>
            {isStudent && (
              <>
                {loadingRequests ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                    <div style={{ width: '32px', height: '32px', border: '2px solid #2563EB', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  </div>
                ) : outgoing.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '80px 40px' }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px', lineHeight: 1 }}>🎓</div>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>You haven't sent any requests yet</h2>
                    <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '28px' }}>Browse mentors and send a request to get started</p>
                    <button onClick={() => setTab('discover')} style={{ padding: '10px 24px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                      Find a Mentor
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '640px' }}>
                    {outgoing.map((match) => {
                      const mentor = match.mentor || {};
                      const mentorName = mentor.name || 'Your mentor';
                      const initials = mentorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                      const statusConfig = {
                        pending: {
                          label: `⏳ Request sent to ${mentorName} — waiting for response`,
                          bg: '#FFFBEB', color: '#92400E', border: '#FCD34D',
                        },
                        active: {
                          label: `✅ ${mentorName} accepted your request! Go to Active Chats to message them.`,
                          bg: '#D1FAE5', color: '#065F46', border: '#6EE7B7',
                        },
                        closed: {
                          label: '❌ Your request was declined. You can request another mentor.',
                          bg: '#FEF2F2', color: '#991B1B', border: '#FECACA',
                        },
                      };
                      const s = statusConfig[match.status] || statusConfig.pending;
                      return (
                        <div key={match._id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '16px', color: '#2563EB', flexShrink: 0 }}>
                            {initials}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A', margin: '0 0 4px' }}>{mentorName}</p>
                            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 8px' }}>{match.subject || '—'}</p>
                            <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                              {s.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
            {isMentor && (
              loadingRequests ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                  <div style={{ width: '32px', height: '32px', border: '2px solid #2563EB', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '640px' }}>
                  {incoming.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748B' }}>
                      <p style={{ fontSize: '48px' }}>🎉</p>
                      <p>No pending requests.</p>
                    </div>
                  ) : incoming.map((req) => {
                    const name = req.studentName || 'Student';
                    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                    const matchId = req.matchId || req._id;
                    return (
                      <div key={req._id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '16px', color: '#2563EB', flexShrink: 0 }}>{initials}</div>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A', margin: '0 0 4px' }}>{name}</p>
                            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>{req.grade || ''}{req.grade && req.subject ? ' · ' : ''}{req.subject || '—'}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            disabled={respondingId === matchId}
                            onClick={() => handleRespond(matchId, 'active')}
                            style={{ flex: 1, padding: '10px', background: '#10B981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                          >✓ Accept</button>
                          <button
                            disabled={respondingId === matchId}
                            onClick={() => handleRespond(matchId, 'closed')}
                            style={{ flex: 1, padding: '10px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                          >✕ Decline</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        )}
        {/* ── CHAT ── */}
        {tab === 'chat' && (
          <div style={{ display: 'flex', height: '600px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #F1F5F9', overflow: 'hidden', margin: '0 0 32px 0' }}>

            {/* ── LEFT PANEL ── */}
            <div style={{ width: '360px', flexShrink: 0, borderRight: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid #F1F5F9' }}>
                <p style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Messages</p>
              </div>
              <div style={{ overflowY: 'auto', flex: 1 }}>
                {activeMatches.length === 0 ? (
                  <div style={{ padding: '48px 24px', textAlign: 'center', color: '#94A3B8' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>💬</div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#64748B' }}>No active chats yet</p>
                    <p style={{ fontSize: '13px', marginTop: '4px' }}>Get a mentor request accepted first</p>
                  </div>
                ) : activeMatches.map((match) => {
                  const mentor = match.mentor || {};
                  const mName = mentor.name || 'Mentor';
                  const initials = mName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                  const isSelected = selectedChat?._id === match._id;
                  return (
                    <div
                      key={match._id}
                      onClick={() => setSelectedChat(match)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '14px 20px', cursor: 'pointer',
                        background: isSelected ? '#EFF6FF' : '#fff',
                        borderLeft: isSelected ? '3px solid #2563EB' : '3px solid transparent',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, color: '#2563EB', flexShrink: 0 }}>
                        {initials}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: '14px', color: '#0F172A', margin: '0 0 3px 0' }}>{mName}</p>
                        <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>{match.subject || 'Active mentor'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {!selectedChat ? (
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
                        {(selectedChat.mentor?.name || 'M').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '16px', color: '#0F172A', margin: '0 0 3px 0' }}>{selectedChat.mentor?.name || 'Mentor'}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                          <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 500 }}>Active</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/mentoring/chat/active')}
                      onMouseEnter={e => e.currentTarget.style.background = '#1D4ED8'}
                      onMouseLeave={e => e.currentTarget.style.background = '#2563EB'}
                      style={{ background: '#2563EB', color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}
                    >
                      Open Chat →
                    </button>
                  </div>

                  {/* CTA panel */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', background: '#F8FAFC' }}>
                    <div style={{ fontSize: '48px' }}>💬</div>
                    <p style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A', margin: 0 }}>
                      Chat with {selectedChat.mentor?.name || 'your mentor'}
                    </p>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Click "Open Chat" to start a real-time conversation</p>
                    <button
                      onClick={() => navigate('/mentoring/chat/active')}
                      style={{ background: '#2563EB', color: '#fff', padding: '12px 28px', borderRadius: '10px', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '15px' }}
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

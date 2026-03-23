import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Users, Star } from 'lucide-react';
import api from '../services/api';
import useAuthStore from '../store/authStore';

const SUBJECTS = [
  'Mathematics', 'Science', 'English', 'Hindi', 'History',
  'Geography', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
];

const LANG_LABELS = { en: 'English', hi: 'Hindi', ta: 'Tamil', te: 'Telugu', kn: 'Kannada', ml: 'Malayalam' };

function formatMsgTime(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function sortByRecent(a, b) { return (b._ts || 0) - (a._ts || 0); }

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
  const userId = user?.id || user?._id;

  const [tab, setTab] = useState('discover');

  useEffect(() => {
    if (location.state?.tab === 'chat') {
      setTab('chat');
    }
  }, [location.state]);

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
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const selectedMatchRef = useRef(null);
  const activeMatchesRef = useRef([]);
  const seenMessageIdsRef = useRef(new Set());

  useEffect(() => { selectedMatchRef.current = selectedMatch; }, [selectedMatch]);
  useEffect(() => { activeMatchesRef.current = activeMatches; }, [activeMatches]);

  // Rating modal
  const [ratingMatch, setRatingMatch] = useState(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  // Socket init — also listens for mentorship notifications (student gets live status update)
  useEffect(() => {
    const socket = io('http://localhost:5000', { autoConnect: true });
    socketRef.current = socket;

    const onConnect = () => {
      const currentUserId = user?.id || user?._id;
      if (currentUserId) {
        socket.emit('register-user', currentUserId);
      }

      activeMatchesRef.current.forEach((m) => {
        const rid = m.roomId || buildRoomIdForMatch(m);
        if (rid) socket.emit('joinRoom', rid);
      });
    };
    socket.on('connect', onConnect);

    // If mentor responds → refresh outgoing list so status badge updates instantly
    socket.on('mentorship-notification', (notif) => {
      if (notif.type === 'request-response') {
        fetchOutgoing();
      }
    });

    return () => {
      socket.off('connect', onConnect);
      socket.disconnect();
    };
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

  useEffect(() => {
    if (tab !== 'chat') return;
    const interval = setInterval(fetchActiveMatches, 5000);
    return () => clearInterval(interval);
  }, [tab]);

  // Poll every 10s while on the My Requests tab (student) so status updates live
  useEffect(() => {
    if (tab !== 'requests' || !isStudent) return;
    const interval = setInterval(fetchOutgoing, 10000);
    return () => clearInterval(interval);
  }, [tab, isStudent]);

  const getOtherParticipant = (match) => {
    const studentId = match?.student?._id?.toString();
    const mentorId = match?.mentor?._id?.toString();
    const me = userId?.toString();
    return me && studentId === me ? match?.mentor : match?.student;
  };

  const buildRoomIdForMatch = (match) => {
    const other = getOtherParticipant(match);
    const otherId = other?._id;
    if (!userId || !otherId) return null;
    return `chat_${[userId.toString(), otherId.toString()].sort().join('_')}`;
  };

  const setLastSeenForRoom = (roomId, messageLike) => {
    if (!roomId) return;
    api.post(`/chat/${roomId}/read`, {
      userId,
      readAt: messageLike?.createdAt || null,
    }).catch(() => {});
    window.dispatchEvent(new Event('chat-lastseen-updated'));
  };

  // Join all chat rooms after active matches load
  useEffect(() => {
    if (tab !== 'chat' || activeMatches.length === 0) return;
    activeMatches.forEach((m) => {
      const roomId = m.roomId || buildRoomIdForMatch(m);
      if (roomId) socketRef.current?.emit('joinRoom', roomId);
    });
  }, [tab, activeMatches.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Global listener for realtime incoming messages
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const onMessage = (msg) => {
      const msgId = msg?._id || `${msg?.roomId || ''}:${msg?.sender || ''}:${msg?.createdAt || ''}:${msg?.text || ''}`;
      if (seenMessageIdsRef.current.has(msgId)) return;
      seenMessageIdsRef.current.add(msgId);
      if (seenMessageIdsRef.current.size > 500) {
        const compact = Array.from(seenMessageIdsRef.current).slice(-300);
        seenMessageIdsRef.current = new Set(compact);
      }

      const hasRoom = activeMatchesRef.current.some(m => m.roomId === msg.roomId);
      if (!hasRoom) {
        fetchActiveMatches();
        return;
      }

      const current = selectedMatchRef.current;
      if (current?.roomId === msg.roomId) {
        setMessages((prev) => [...prev, msg]);
        setLastSeenForRoom(msg.roomId, msg);
      }

      setActiveMatches((prev) => prev.map((m) => {
        if (m.roomId !== msg.roomId) return m;
        const incoming = String(msg.sender) !== String(userId);
        return {
          ...m,
          lastMsg: msg.text || '',
          time: formatMsgTime(msg.createdAt),
          _ts: new Date(msg.createdAt).getTime() || Date.now(),
          unread: current?._id === m._id ? 0 : incoming ? (m.unread || 0) + 1 : (m.unread || 0),
        };
      }).sort(sortByRecent));
    };

    socket.on('receiveMessage', onMessage);
    socket.on('chat-message', onMessage);
    return () => {
      socket.off('receiveMessage', onMessage);
      socket.off('chat-message', onMessage);
    };
  }, [userId]);

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
      const list = data.data || [];
      const hydrated = await Promise.all(list.map(async (match) => {
        const other = getOtherParticipant(match);
        const roomId = buildRoomIdForMatch(match);
        const base = {
          ...match,
          roomId,
          displayName: other?.name || 'Mentor',
          initials: (other?.name || 'M').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
          lastMsg: '',
          time: '',
          unread: 0,
        };
        if (!roomId) return base;
        try {
          const [messagesRes, statusRes] = await Promise.all([
            fetch(`http://localhost:5000/api/chat/${roomId}`),
            api.get(`/chat/${roomId}/status`, { params: { userId } }),
          ]);
          const roomMessages = await messagesRes.json();
          if (!Array.isArray(roomMessages) || roomMessages.length === 0) return base;
          const lastMsgObj = roomMessages[roomMessages.length - 1];
          const unreadCount = statusRes.data?.unreadCount || 0;
          return {
            ...base,
            lastMsg: lastMsgObj.text || '',
            time: formatMsgTime(lastMsgObj.createdAt),
            _ts: new Date(lastMsgObj.createdAt).getTime() || 0,
            unread: unreadCount,
          };
        } catch {
          return base;
        }
      }));
      setActiveMatches([...hydrated].sort(sortByRecent));
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
      api.post('/activity', { type: 'mentor_connected', title: 'Mentor Request Sent', description: `Requested ${mentor.user?.name || 'a mentor'} as your mentor` }).catch(() => {});
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

  async function handleSelectMatch(match) {
    const roomId = match.roomId || buildRoomIdForMatch(match);
    if (!roomId) return;

    setSelectedMatch(match);

    setActiveMatches(prev => prev.map(m => m._id === match._id ? { ...m, unread: 0 } : m));

    try {
      socketRef.current?.emit('joinRoom', roomId);
      const res = await fetch(`http://localhost:5000/api/chat/${roomId}`);
      const roomMessages = await res.json();
      if (Array.isArray(roomMessages) && roomMessages.length > 0) {
        setLastSeenForRoom(roomId, roomMessages[roomMessages.length - 1]);
      }
      setMessages(Array.isArray(roomMessages) ? roomMessages : []);
    } catch {
      setMessages([]);
    }
  }

  function handleSend() {
    if (!newMsg.trim() || !selectedMatch) return;
    const roomId = selectedMatch.roomId || buildRoomIdForMatch(selectedMatch);
    if (!roomId) return;
    socketRef.current?.emit('sendMessage', {
      roomId,
      sender: userId,
      senderRole: user?.role,
      senderName: user?.name,
      text: newMsg.trim(),
    });
    setNewMsg('');
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

  const unreadChatCount = activeMatches.reduce((sum, m) => sum + (m.unread > 0 ? 1 : 0), 0);
  const hidePageChrome = tab === 'chat' && Boolean(selectedMatch);
  const pageContentStyle = hidePageChrome
    ? { maxWidth: 'none', margin: 0, padding: 0 }
    : { maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' };
  const chatContainerStyle = hidePageChrome
    ? {
        display: 'flex',
        height: 'calc(100vh - 68px)',
        background: '#fff',
        borderRadius: 0,
        boxShadow: 'none',
        border: 'none',
        overflow: 'hidden',
        margin: 0,
      }
    : {
        display: 'flex',
        height: '600px',
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        border: '1px solid #F1F5F9',
        overflow: 'hidden',
        margin: '0 0 32px 0',
      };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: '68px' }}>

      {/* ── Page Header Band ── */}
      {!hidePageChrome && (
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
                {t.id === 'chat' && unreadChatCount > 0 && (
                  <span style={{ marginLeft: 6, background: '#EF4444', color: '#fff', borderRadius: 999, fontSize: 10, fontWeight: 700, padding: '1px 6px' }}>
                    {unreadChatCount}
                  </span>
                )}
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
      )}

      {/* ── Page Content ── */}
      <div style={pageContentStyle}>

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
          <div style={chatContainerStyle}>

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
                  const isSelected = selectedMatch?._id === match._id;
                  return (
                    <div
                      key={match._id}
                      onClick={() => handleSelectMatch(match)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '14px 20px', cursor: 'pointer',
                        background: isSelected ? '#EFF6FF' : '#fff',
                        borderLeft: isSelected ? '3px solid #2563EB' : '3px solid transparent',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, color: '#2563EB', flexShrink: 0 }}>
                        {match.initials}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                          <p style={{ fontWeight: 600, fontSize: '14px', color: '#0F172A', margin: '0 0 3px 0' }}>{match.displayName}</p>
                          <span style={{ fontSize: 11, color: '#94A3B8', flexShrink: 0 }}>{match.time || ''}</span>
                        </div>
                        <p style={{ fontSize: '13px', color: '#64748B', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {match.lastMsg || 'No messages yet'}
                        </p>
                      </div>
                      {match.unread > 0 && (
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#059669', color: 'white', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {match.unread}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {!selectedMatch ? (
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
                        {selectedMatch.initials}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '16px', color: '#0F172A', margin: '0 0 3px 0' }}>{selectedMatch.displayName}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                          <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 500 }}>Active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10, background: '#F8FAFC' }}>
                    {messages.length === 0 && (
                      <div style={{ textAlign: 'center', color: '#94A3B8', marginTop: 40 }}>
                        <p style={{ fontSize: 28 }}>💬</p>
                        <p style={{ fontSize: 13 }}>No messages yet</p>
                      </div>
                    )}
                    {messages.map((m) => {
                      const isMine = String(m.sender) === String(userId);
                      return (
                        <div key={m._id || m.createdAt} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                          <div style={{
                            maxWidth: '70%', padding: '10px 14px', borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                            background: isMine ? '#2563EB' : 'white',
                            color: isMine ? 'white' : '#374151',
                            fontSize: 14, lineHeight: 1.5,
                            boxShadow: !isMine ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                          }}>
                            <p style={{ margin: '0 0 4px' }}>{m.text}</p>
                            <p style={{ margin: 0, fontSize: 11, opacity: 0.7, textAlign: 'right' }}>{formatMsgTime(m.createdAt)}</p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div style={{ padding: '12px 20px', borderTop: '1px solid #F1F5F9', display: 'flex', gap: 10 }}>
                    <input
                      value={newMsg}
                      onChange={e => setNewMsg(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Type a message..."
                      style={{ flex: 1, padding: '10px 16px', border: '1.5px solid #E2E8F0', borderRadius: 24, fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#374151', background: '#fff' }}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!newMsg.trim()}
                      style={{ width: 42, height: 42, borderRadius: '50%', background: newMsg.trim() ? '#2563EB' : '#E2E8F0', color: 'white', border: 'none', cursor: newMsg.trim() ? 'pointer' : 'not-allowed', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    >
                      ➤
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

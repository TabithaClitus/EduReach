import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Menu, X, ChevronDown, LogOut, User, Bell } from "lucide-react";
import { io } from "socket.io-client";
import useAuthStore from "../../store/authStore";
import useLanguageStore from "../../store/languageStore";
import api from "../../services/api";

const studentLinks = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Learning", path: "/learning" },
  { label: "Scholarships", path: "/scholarships" },
  { label: "Mentoring", path: "/mentoring" },
  { label: "Quiz", path: "/quiz" },
  { label: "Study Plan", path: "/study-plan" },
  { label: "Speech Therapy", path: "/speech-therapy" },
  { label: "🤖 AI Tutor", path: "/doubt-solver" },
];

const mentorLinks = [
  { label: "Dashboard", path: "/mentor-dashboard" },
  { label: "My Students", path: "/mentor-dashboard?tab=students" },
  { label: "Requests", path: "/mentor-dashboard?tab=requests" },
  { label: "Chats", path: "/mentor-dashboard?tab=chats" },
];

const adminLinks = [
  { label: "Overview", path: "/admin" },
  { label: "Users", path: "/admin?tab=users" },
  { label: "Scholarships", path: "/admin?tab=scholarships" },
  { label: "Mentors", path: "/admin?tab=mentors" },
  { label: "Reports", path: "/admin?tab=reports" },
];

const languages = [
  { code: "en", label: "EN" },
  { code: "ta", label: "TA" },
  { code: "hi", label: "HI" },
  { code: "te", label: "TE" },
  { code: "kn", label: "KN" },
  { code: "ml", label: "ML" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { isAuthenticated, user, token, logout } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();
  const navigate = useNavigate();
  const hasSession = isAuthenticated || Boolean(user && token);
  const role = user?.role || 'student';

  const logoPath = !hasSession ? '/' :
    role === 'mentor' ? '/mentor-dashboard' :
    role === 'admin' ? '/admin' : '/dashboard';

  const [pendingRequests, setPendingRequests] = useState(0);
  const [unreadChats, setUnreadChats] = useState(0);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);

  // ── Notification toasts ─────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);
  const socketRef = useRef(null);

  const addToast = (msg, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  const fetchUnreadChats = async () => {
    if (role !== 'mentor' || !hasSession || !user) {
      setUnreadChats(0);
      return;
    }

    const mentorId = user.id || user._id;
    if (!mentorId) return;

    try {
      const { data } = await api.get('/mentors/my-students');
      const students = data.data || [];

      const unreadByRoom = await Promise.all(students.map(async (s) => {
        const studentId = s.studentId?.toString() || s._id?.toString();
        if (!studentId) return 0;

        const roomId = `chat_${[mentorId.toString(), studentId.toString()].sort().join('_')}`;
        try {
          const res = await fetch(`http://localhost:5000/api/chat/${roomId}`);
          const roomMessages = await res.json();
          if (!Array.isArray(roomMessages) || roomMessages.length === 0) return 0;

          const lastSeen = Number(localStorage.getItem('lastSeen_' + roomId) || '0');
          const hasUnread = roomMessages.some(m => (
            new Date(m.createdAt).getTime() > lastSeen &&
            String(m.sender) !== String(mentorId)
          ));
          return hasUnread ? 1 : 0;
        } catch {
          return 0;
        }
      }));

      setUnreadChats(unreadByRoom.reduce((sum, value) => sum + value, 0));
    } catch {
      setUnreadChats(0);
    }
  };

  // ── Socket: register user + listen for mentorship notifications ───────────
  useEffect(() => {
    if (!hasSession || !user) return;
    const userId = user.id || user._id;
    if (!userId) return;

    const socket = io('http://localhost:5000', { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('register-user', userId);
    });

    socket.on('mentorship-notification', (notif) => {
      addToast(notif.message, notif.type === 'new-request' ? 'request' : 'response');
      // Update mentor badge count in real-time
      if (role === 'mentor' && notif.type === 'new-request') {
        setPendingRequests(prev => prev + 1);
      }
    });

    socket.on('receiveMessage', (msg) => {
      if (role !== 'mentor') return;
      if (String(msg.sender) === String(userId)) return;
      localStorage.setItem('lastMessageTs_' + msg.roomId, String(new Date(msg.createdAt).getTime() || Date.now()));
      fetchUnreadChats();
    });

    return () => socket.disconnect();
  }, [hasSession, user?.id || user?._id]);

  // ── Initial + polling fetch of pending count for mentor (every 15s) ────────
  useEffect(() => {
    if (role !== 'mentor') return;
    const fetchCount = () => {
      api.get('/mentors/incoming')
        .then(({ data }) => setPendingRequests((data.data || []).length))
        .catch(() => {});
    };
    fetchCount();
    const interval = setInterval(fetchCount, 15000);
    return () => clearInterval(interval);
  }, [role]);

  useEffect(() => {
    if (role !== 'mentor') return;
    fetchUnreadChats();
    const interval = setInterval(fetchUnreadChats, 15000);
    const onStorage = () => fetchUnreadChats();
    const onSeenUpdated = () => fetchUnreadChats();
    window.addEventListener('storage', onStorage);
    window.addEventListener('chat-lastseen-updated', onSeenUpdated);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('chat-lastseen-updated', onSeenUpdated);
    };
  }, [role, hasSession, user?.id, user?._id]);

  useEffect(() => {
    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredInstallPrompt(event);
      setCanInstall(true);
    };

    const onInstalled = () => {
      setDeferredInstallPrompt(null);
      setCanInstall(false);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') {
      setCanInstall(false);
      setDeferredInstallPrompt(null);
    }
  };

  const baseLinks = !hasSession ? [] : role === 'mentor' ? mentorLinks : role === 'admin' ? adminLinks : studentLinks;
  const navLinks = role === 'mentor'
    ? baseLinks.map(link => {
        if (link.label === 'Requests') return { ...link, badge: pendingRequests };
        if (link.label === 'Chats') return { ...link, badge: unreadChats };
        return link;
      })
    : baseLinks;

  const handleLogout = () => {
    window.location.replace('/');
    logout();
  };

  return (
    <>
      {/* ── Toast Notifications ── */}
      <div style={{ position: 'fixed', top: '80px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px', pointerEvents: 'none' }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: t.type === 'request' ? '#EFF6FF' : t.type === 'response' ? '#ECFDF5' : '#F8FAFC',
            border: `1px solid ${t.type === 'request' ? '#BFDBFE' : t.type === 'response' ? '#A7F3D0' : '#E2E8F0'}`,
            borderLeft: `4px solid ${t.type === 'request' ? '#2563EB' : t.type === 'response' ? '#10B981' : '#64748B'}`,
            borderRadius: '10px',
            padding: '12px 16px',
            minWidth: '280px',
            maxWidth: '360px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            animation: 'slideInRight 0.3s ease',
            pointerEvents: 'auto',
          }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{t.msg}</p>
          </div>
        ))}
      </div>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #F1F5F9",
        height: "68px",
        display: "flex", alignItems: "center",
      }}>
      <div style={{ width: "100%", padding: "0 24px", display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: "0" }}>

        {/* Logo — left */}
        <div onClick={() => navigate(logoPath)} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", marginRight: "40px", cursor: "pointer" }}>
          <div style={{ width: "36px", height: "36px", background: "#2563EB", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GraduationCap size={20} color="white" />
          </div>
          <span style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Edu<span style={{ color: "#2563EB" }}>Reach</span>
          </span>
        </div>

        {/* Nav Links — center */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "28px" }}>
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} style={{ fontSize: "14px", fontWeight: 500, color: "#64748B", textDecoration: "none", whiteSpace: "nowrap", display: "flex", alignItems: "center" }}
              onMouseEnter={e => e.currentTarget.style.color = "#2563EB"}
              onMouseLeave={e => e.currentTarget.style.color = "#64748B"}>
              {link.label}
              {link.badge > 0 && (
                <span style={{ background: "#ef4444", color: "#fff", borderRadius: "99px", fontSize: "11px", fontWeight: "700", padding: "1px 7px", marginLeft: "5px" }}>
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Right side — EN, Login, Register */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", justifyContent: "flex-end" }}>

          {canInstall && (
            <button
              onClick={handleInstall}
              style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF", background: "#2563EB", border: "none", borderRadius: "8px", padding: "7px 12px", cursor: "pointer" }}
              title="Install EduReach"
            >
              Install App
            </button>
          )}

          {/* Language */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setLangOpen(!langOpen)} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: 600, color: "#64748B", background: "none", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "6px 12px", cursor: "pointer" }}>
              {language.toUpperCase()} <ChevronDown size={12} />
            </button>
            {langOpen && (
              <div style={{ position: "absolute", right: 0, top: "40px", background: "#fff", border: "1px solid #F1F5F9", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", padding: "8px", minWidth: "100px", zIndex: 200 }}>
                {languages.map(l => (
                  <button key={l.code} onClick={() => { setLanguage(l.code); setLangOpen(false); }}
                    style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", fontSize: "13px", fontWeight: 500, color: language === l.code ? "#2563EB" : "#334155", background: language === l.code ? "#EFF6FF" : "none", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={16} color="#2563EB" />
              </div>
              <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: "#64748B", background: "none", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "6px 14px", cursor: "pointer" }}>
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link to="/login" style={{ fontSize: "14px", fontWeight: 600, color: "#334155", textDecoration: "none", padding: "8px 16px" }}>
                Login
              </Link>
              <Link to="/register" style={{ fontSize: "14px", fontWeight: 700, color: "#fff", background: "#2563EB", textDecoration: "none", padding: "8px 20px", borderRadius: "8px" }}>
                Register
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
    </>
  );
}
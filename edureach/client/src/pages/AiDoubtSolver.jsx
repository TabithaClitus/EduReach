import { useState, useRef, useEffect, useCallback } from 'react';
import api from '../services/api';

function groupByDate(convos) {
  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yest  = today - 86400000;
  const week  = today - 6 * 86400000;
  const groups = { Today: [], Yesterday: [], 'Previous 7 Days': [], Older: [] };
  for (const c of convos) {
    const t = new Date(c.updatedAt).getTime();
    if      (t >= today) groups.Today.push(c);
    else if (t >= yest)  groups.Yesterday.push(c);
    else if (t >= week)  groups['Previous 7 Days'].push(c);
    else                 groups.Older.push(c);
  }
  return groups;
}

// --- Typing dots ---
function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 5, padding: '14px 18px', alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#7C3AED', display: 'inline-block', animation: `edubot-bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
    </div>
  );
}

function getPreferredVoice(voices, mode) {
  if (!Array.isArray(voices) || voices.length === 0) return null;

  const indianLocaleRegex = /^(en|hi|bn|ta|te|kn|ml|mr|gu|pa|or|as|ur)-in$/i;
  const indianNameRegex = /india|indian|hindi|bharat|aditi|heera|priya|veena|kavya|lekha|swara|sangeeta|kalpana|raveena|neel|ravi|amit/i;

  // Strict match: do not allow UK/US fallback for EN mode.
  const tier1 = mode === 'hi'
    ? voices.filter((v) => /^hi-in$/i.test(v.lang) || /hindi/i.test(v.name))
    : voices.filter((v) => /^en-in$/i.test(v.lang) || (indianNameRegex.test(v.name || '') && /^en/i.test(v.lang || '')));

  const tier2 = mode === 'hi'
    ? voices.filter((v) => /^(hi|hi-in)/i.test(v.lang) || (indianLocaleRegex.test(v.lang || '') && indianNameRegex.test(v.name || '')))
    : voices.filter((v) => indianLocaleRegex.test(v.lang || ''));

  const tier3 = mode === 'hi'
    ? voices.filter((v) => indianLocaleRegex.test(v.lang || '') || indianNameRegex.test(v.name || ''))
    : voices.filter((v) => indianNameRegex.test(v.name || ''));

  const candidates = tier1.length ? tier1 : tier2.length ? tier2 : tier3.length ? tier3 : [];
  if (!candidates.length) return null;

  const scored = candidates.map((v) => {
    const name = (v.name || '').toLowerCase();
    const lang = (v.lang || '').toLowerCase();
    let score = 0;

    // Prefer high-quality neural/natural/cloud voices first.
    if (/neural|natural|wavenet|premium|enhanced|studio|online/.test(name)) score += 80;
    if (v.localService === false) score += 20;

    // Prefer Indian voices when available.
    if (indianLocaleRegex.test(lang)) score += 140;
    if (indianNameRegex.test(name)) score += 120;

    // Prefer female-like voices for clarity, as requested.
    if (/female|woman|girl|samantha|zira|jenny|aria|sonia|natasha|priya|heera|veena|aditi/.test(name)) score += 40;

    // Prefer familiar engines that often sound less robotic.
    if (/google|microsoft|apple/.test(name)) score += 25;

    // Exact locale match for selected mode.
    if (mode === 'hi' && lang === 'hi-in') score += 90;
    if (mode === 'en' && lang === 'en-in') score += 90;

    return { v, score };
  }).sort((a, b) => b.score - a.score);

  return scored[0]?.v || null;
}

function sanitizeForSpeech(text) {
  if (!text) return '';

  const withoutEmoji = text
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, ' ')
    .replace(/[\u2600-\u27BF]/g, ' ')
    .replace(/[\uFE0F]/g, ' ');

  const normalizedCodeText = withoutEmoji
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\bif\s*-\s*else\b/gi, 'if else')
    .replace(/\belse\s*-\s*if\b/gi, 'else if')
    .replace(/([A-Za-z])\s*-\s*([A-Za-z])/g, '$1 $2');

  const normalizedLines = normalizedCodeText
    .split('\n')
    .map((line) => line.replace(/^[^\p{L}\p{N}]+/gu, '').trim())
    .filter(Boolean);

  return normalizedLines.join(' ').replace(/\s+/g, ' ').trim();
}

// --- Message bubble ---
function Message({ msg, index, speakingIndex, onToggleSpeak }) {
  const isUser = msg.role === 'user';
  const isSpeaking = !isUser && speakingIndex === index;
  return (
    <div style={{ display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 10, marginBottom: 20, animation: 'msg-fade-in 0.2s ease-out', maxWidth: 780, width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
      {!isUser && (
        <div style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: '0 2px 8px rgba(124,58,237,0.3)' }}>
          🤖
        </div>
      )}
      <div style={{ maxWidth: isUser ? '70%' : '80%', padding: '12px 16px', borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: isUser ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' : '#FFFFFF', color: isUser ? '#FFFFFF' : '#1E293B', fontSize: 15, lineHeight: 1.65, boxShadow: isUser ? '0 4px 14px rgba(124,58,237,0.28)' : '0 2px 12px rgba(0,0,0,0.07)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {msg.content}
        {!isUser && (
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className={isSpeaking ? 'eb-speaker eb-speaker-on' : 'eb-speaker'}
              onClick={() => onToggleSpeak(index, msg.content)}
              title={isSpeaking ? 'Stop' : 'Read aloud'}
            >
              {isSpeaking ? '⏹️' : '🔊'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Main page ---
export default function AiDoubtSolver() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId]           = useState(null);
  const [messages, setMessages]           = useState([]);
  const [input, setInput]                 = useState('');
  const [loading, setLoading]             = useState(false);
  const [listening, setListening]         = useState(false);
  const [speechMode, setSpeechMode]       = useState('en');
  const [toast, setToast]                 = useState('');
  const [voices, setVoices]               = useState([]);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [sidebarLoading, setSidebarLoading] = useState(true);

  const chatEndRef     = useRef(null);
  const inputRef       = useRef(null);
  const recognitionRef = useRef(null);
  const activeIdRef    = useRef(null);
  const utterRef       = useRef(null);

  useEffect(() => { activeIdRef.current = activeId; }, [activeId]);

  // Load conversations list on mount
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/conversations');
        const convos = data.conversations || [];
        setConversations(convos);
        if (convos.length > 0) {
          // Auto-load most recent
          const { data: d } = await api.get(`/conversations/${convos[0]._id}`);
          setActiveId(convos[0]._id);
          activeIdRef.current = convos[0]._id;
          setMessages(d.conversation.messages);
        }
      } catch (err) {
        console.error('Failed to load conversations', err);
      } finally {
        setSidebarLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-IN';
    rec.onresult = (e) => {
      const t = e.results[0][0].transcript;
      setInput((prev) => (prev ? prev + ' ' + t : t));
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend   = () => setListening(false);
    recognitionRef.current = rec;
    return () => rec.stop();
  }, []);

  useEffect(() => {
    if (!window.speechSynthesis) return;

    const loadVoices = () => {
      const list = window.speechSynthesis.getVoices() || [];
      setVoices(list);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => () => {
    recognitionRef.current?.stop();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  const newChat = () => {
    setActiveId(null);
    activeIdRef.current = null;
    setMessages([]);
    setInput('');
    if (inputRef.current) { inputRef.current.style.height = 'auto'; }
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const loadConversation = async (convo) => {
    setActiveId(convo._id);
    activeIdRef.current = convo._id;
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    try {
      const { data } = await api.get(`/conversations/${convo._id}`);
      setMessages(data.conversation.messages);
    } catch {
      setMessages([]);
    }
  };

  const deleteConversation = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/conversations/${id}`);
      const updated = conversations.filter((c) => c._id !== id);
      setConversations(updated);
      if (activeIdRef.current === id) {
        if (updated.length > 0) {
          const { data } = await api.get(`/conversations/${updated[0]._id}`);
          setActiveId(updated[0]._id);
          activeIdRef.current = updated[0]._id;
          setMessages(data.conversation.messages);
        } else {
          setActiveId(null);
          activeIdRef.current = null;
          setMessages([]);
        }
      }
    } catch (err) {
      console.error('Failed to delete conversation', err);
    }
  };

  const toggleMic = () => {
    if (!recognitionRef.current) {
      setToast('Voice not supported on this browser');
      return;
    }

    recognitionRef.current.lang = speechMode === 'hi' ? 'hi-IN' : 'en-IN';
    if (listening) { recognitionRef.current.stop(); setListening(false); }
    else           { recognitionRef.current.start(); setListening(true); }
  };

  const toggleSpeak = (index, text) => {
    const spokenText = sanitizeForSpeech(text);
    if (!window.speechSynthesis || !spokenText) return;

    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      utterRef.current = null;
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();

    const liveVoices = window.speechSynthesis.getVoices?.() || [];
    const selectedVoice = getPreferredVoice(liveVoices.length ? liveVoices : voices, speechMode);
    if (!selectedVoice) {
      setToast(speechMode === 'hi' ? 'Hindi Indian voice not available on this browser' : 'Indian English voice not available on this browser');
      setSpeakingIndex(null);
      return;
    }

    const utter = new SpeechSynthesisUtterance(spokenText);
    utter.voice = selectedVoice;
    utter.lang = selectedVoice.lang || (speechMode === 'hi' ? 'hi-IN' : 'en-IN');
    utter.rate = 0.9;
    utter.pitch = 1;

    utter.onend = () => {
      setSpeakingIndex((current) => (current === index ? null : current));
      utterRef.current = null;
    };
    utter.onerror = () => {
      setSpeakingIndex((current) => (current === index ? null : current));
      utterRef.current = null;
    };

    utterRef.current = utter;
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utter);
  };

  const sendMessage = useCallback(async (textArg) => {
    const q = (textArg || input).trim();
    if (!q || loading) return;
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';

    const isNew   = !activeIdRef.current;
    const userMsg = { role: 'user', content: q };
    const next    = [...messages, userMsg];
    setMessages(next);
    setLoading(true);

    let aiContent = '';
    try {
      const { data } = await api.post('/doubt/ask', {
        question: q, subject: '', grade: '',
        history: next.slice(-6).map((m) => ({ role: m.role, content: m.content })),
      });
      aiContent = data.answer;
    } catch (err) {
      aiContent = err?.response?.data?.error || 'Oops! Something went wrong. Please try again 🙏';
    }

    const finalMessages = [...next, { role: 'ai', content: aiContent }];
    setMessages(finalMessages);
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 50);

    // Persist to DB
    try {
      if (isNew) {
        const { data } = await api.post('/conversations', { title: q, messages: finalMessages });
        const newConvo = data.conversation;
        setActiveId(newConvo._id);
        activeIdRef.current = newConvo._id;
        setConversations((prev) => [newConvo, ...prev]);
      } else {
        const { data } = await api.put(`/conversations/${activeIdRef.current}`, { messages: finalMessages });
        const updated = data.conversation;
        setConversations((prev) =>
          [updated, ...prev.filter((c) => c._id !== updated._id)]
        );
      }
    } catch (err) {
      console.error('Failed to save conversation', err);
    }
  }, [input, messages, loading]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const groups = groupByDate(conversations);

  return (
    <>
      <style>{`
        @keyframes edubot-bounce { 0%,60%,100% { transform:translateY(0);opacity:.6 } 30% { transform:translateY(-7px);opacity:1 } }
        @keyframes msg-fade-in   { from { opacity:0;transform:translateY(6px) } to { opacity:1;transform:translateY(0) } }
        @keyframes hdr-shimmer   { 0%,100% { background-position:0% 50% } 50% { background-position:100% 50% } }
        .eb-input:focus  { outline:none; box-shadow:0 0 0 3px rgba(124,58,237,.18); }
        .eb-send:hover:not(:disabled) { transform:scale(1.06); }
        .eb-send:active:not(:disabled){ transform:scale(.96); }
        .eb-chat::-webkit-scrollbar   { width:5px; }
        .eb-chat::-webkit-scrollbar-thumb  { background:#DDD6FE; border-radius:99px; }
        .eb-chat::-webkit-scrollbar-track  { background:transparent; }
        .eb-sidebar::-webkit-scrollbar     { width:4px; }
        .eb-sidebar::-webkit-scrollbar-thumb { background:#3D3A52; border-radius:99px; }
        .eb-sidebar::-webkit-scrollbar-track { background:transparent; }
        .eb-convo { position:relative; display:flex; align-items:center; gap:6px; padding:8px 10px; border-radius:8px; cursor:pointer; transition:background .15s; }
        .eb-convo:hover { background:#2D2A40; }
        .eb-del { opacity:0; transition:opacity .15s; background:none; border:none; cursor:pointer; padding:2px 5px; font-size:13px; line-height:1; color:#64748B; border-radius:4px; flex-shrink:0; }
        .eb-del:hover { color:#F87171; background:rgba(239,68,68,.12); }
        .eb-convo:hover .eb-del { opacity:1; }
        .eb-new-chat:hover { opacity:.85; }
        @keyframes mic-pulse { 0% { box-shadow:0 0 0 0 rgba(220,38,38,.45); } 70% { box-shadow:0 0 0 12px rgba(220,38,38,0); } 100% { box-shadow:0 0 0 0 rgba(220,38,38,0); } }
        @keyframes speaker-wave { 0%,100% { transform:scale(1); } 50% { transform:scale(1.12); } }
        .eb-mic-listening { animation: mic-pulse 1.15s infinite; }
        .eb-speaker { border:none; background:#F1F5F9; border-radius:999px; width:30px; height:30px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:14px; transition:transform .15s, background .15s; }
        .eb-speaker:hover { background:#E2E8F0; transform:scale(1.05); }
        .eb-speaker-on { background:#FEE2E2; animation:speaker-wave .9s ease-in-out infinite; }
      `}</style>

      <div style={{ position: 'fixed', top: 68, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'row', overflow: 'hidden', zIndex: 1 }}>

        {/* ── Sidebar ── */}
        <div className="eb-sidebar" style={{ width: 280, flexShrink: 0, background: '#1E1B2E', display: 'flex', flexDirection: 'column', borderRight: '1px solid #2D2A40', overflowY: 'auto' }}>
          <div style={{ padding: '14px 12px 10px' }}>
            <button className="eb-new-chat" onClick={newChat}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(124,58,237,.5)', background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)', color: '#FFF', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', boxShadow: '0 2px 10px rgba(124,58,237,.35)', transition: 'opacity .15s' }}>
              ✏️ New Chat
            </button>
          </div>

          <div style={{ flex: 1, padding: '0 8px 16px' }}>
            {sidebarLoading && (
              <p style={{ color: '#4B5563', fontSize: 12.5, textAlign: 'center', marginTop: 28 }}>Loading…</p>
            )}
            {!sidebarLoading && conversations.length === 0 && (
              <p style={{ color: '#4B5563', fontSize: 12.5, textAlign: 'center', marginTop: 28, lineHeight: 1.7, padding: '0 12px' }}>
                No conversations yet.<br />Start asking to save history!
              </p>
            )}
            {Object.entries(groups).map(([label, items]) =>
              items.length === 0 ? null : (
                <div key={label}>
                  <p style={{ color: '#6B7280', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '14px 4px 4px', paddingLeft: 4 }}>{label}</p>
                  {items.map((c) => (
                    <div key={c._id} className="eb-convo"
                      style={{ background: activeId === c._id ? '#2D2A40' : 'transparent' }}
                      onClick={() => loadConversation(c)}>
                      <span style={{ flex: 1, fontSize: 13, color: activeId === c._id ? '#DDD6FE' : '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.4 }}>
                        {c.title}
                      </span>
                      <button className="eb-del" onClick={(e) => deleteConversation(e, c._id)} title="Delete chat">🗑️</button>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>

        {/* ── Chat panel ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F8F7FF', overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 40%, #6D28D9 70%, #7C3AED 100%)', backgroundSize: '300% 300%', animation: 'hdr-shimmer 8s ease infinite', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 4px 20px rgba(124,58,237,.28)', flexShrink: 0 }}>
            <span style={{ fontSize: 26 }}>🤖</span>
            <div>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#FFF', letterSpacing: '-0.3px' }}>AI Doubt Solver</h1>
              <p  style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,.78)', marginTop: 1 }}>Ask any question — EduBot is here to help you learn! ✨</p>
            </div>
          </div>

          <div className="eb-chat" style={{ flex: 1, overflowY: 'auto', padding: '28px 20px 12px', display: 'flex', flexDirection: 'column' }}>
            {messages.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '30px 20px' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', marginBottom: 18, background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, boxShadow: '0 8px 32px rgba(124,58,237,.32)' }}>🤖</div>
                <h2 style={{ margin: '0 0 8px', fontSize: 21, fontWeight: 700, color: '#1E293B' }}>Hi there! I'm EduBot 👋</h2>
                <p  style={{ margin: 0, fontSize: 14.5, color: '#64748B', maxWidth: 400, lineHeight: 1.65 }}>
                  Your friendly AI tutor for classes 6–12. Ask me anything — Maths, Science, History, or any subject!
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <Message
                    key={i}
                    msg={msg}
                    index={i}
                    speakingIndex={speakingIndex}
                    onToggleSpeak={toggleSpeak}
                  />
                ))}
                {loading && (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 20, maxWidth: 780, width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: '0 2px 8px rgba(124,58,237,.3)' }}>🤖</div>
                    <div style={{ borderRadius: '18px 18px 18px 4px', background: '#FFFFFF', boxShadow: '0 2px 12px rgba(0,0,0,.07)' }}><TypingDots /></div>
                  </div>
                )}
              </>
            )}
            <div ref={chatEndRef} />
          </div>

          <div style={{ padding: '12px 20px 16px', borderTop: '1px solid #EDE9FE', background: '#FFFFFF', flexShrink: 0 }}>
            <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <textarea ref={inputRef} className="eb-input" value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask your doubt here… (Enter to send, Shift+Enter for new line)"
                rows={1}
                style={{ flex: 1, padding: '12px 16px', borderRadius: 14, border: '1.5px solid #DDD6FE', background: '#FAFAFA', fontSize: 14.5, color: '#1E293B', resize: 'none', lineHeight: 1.55, fontFamily: 'inherit', maxHeight: 140, overflowY: 'auto', transition: 'box-shadow .2s' }}
                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px'; }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, border: '1px solid #DDD6FE', borderRadius: 10, padding: 3, background: '#FFFFFF', height: 44 }}>
                <button
                  type="button"
                  onClick={() => setSpeechMode('en')}
                  style={{ border: 'none', borderRadius: 7, padding: '4px 8px', background: speechMode === 'en' ? '#EDE9FE' : 'transparent', color: '#4C1D95', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                  title="English"
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setSpeechMode('hi')}
                  style={{ border: 'none', borderRadius: 7, padding: '4px 8px', background: speechMode === 'hi' ? '#EDE9FE' : 'transparent', color: '#4C1D95', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                  title="Hindi"
                >
                  हिं
                </button>
              </div>
              <button onClick={toggleMic} title={listening ? 'Stop' : 'Speak'}
                className={listening ? 'eb-mic-listening' : ''}
                style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, border: `1.5px solid ${listening ? '#DC2626' : '#DDD6FE'}`, background: listening ? '#FEE2E2' : '#FFFFFF', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}>
                🎤
              </button>
              <button className="eb-send" onClick={() => sendMessage()} disabled={!input.trim() || loading}
                style={{ height: 44, padding: '0 18px', borderRadius: 12, flexShrink: 0, border: 'none', background: !input.trim() || loading ? '#E5E7EB' : 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)', color: !input.trim() || loading ? '#9CA3AF' : '#FFFFFF', fontSize: 14, fontWeight: 600, cursor: !input.trim() || loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all .15s ease', boxShadow: !input.trim() || loading ? 'none' : '0 4px 14px rgba(124,58,237,.3)' }}>
                Send <span style={{ fontSize: 15 }}>➤</span>
              </button>
            </div>
            <p style={{ margin: '8px auto 0', maxWidth: 780, fontSize: 11, color: '#CBD5E1', textAlign: 'center' }}>
              EduBot can make mistakes. Always verify important facts with your textbook.
            </p>
            {toast && (
              <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#0F172A', color: '#FFFFFF', padding: '9px 12px', fontSize: 12.5, borderRadius: 10, boxShadow: '0 10px 24px rgba(15,23,42,.28)', zIndex: 20 }}>
                {toast}
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
}

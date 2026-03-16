import { useState, useEffect } from "react";
import { Search, ChevronDown, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import Loader from "../components/common/Loader";

const CATEGORIES = [
  "All Categories",
  "Merit", "Need-based", "Merit-cum-Means",
  "Technical", "State", "Minority", "Corporate",
  "Foundation", "Defence", "Pre-Matric",
  "Post-Matric", "Higher Education", "Research Fellowship",
];

const STATES = [
  "State",
  "Tamil Nadu", "Karnataka", "Uttar Pradesh", "Maharashtra",
  "Andhra Pradesh", "Telangana", "Kerala", "Rajasthan", "Bihar",
];

const JUNK_RE = /whatsapp|^buddy4study|channel|messaging|telegram|newsletter/i;

const isValid = (s) => {
  if (!s.title || s.title.length < 8) return false;
  if (JUNK_RE.test(s.title)) return false;
  if (!s.applicationUrl || !s.applicationUrl.startsWith("http")) return false;
  if (s.amount && !/\d/.test(s.amount)) return false;
  return true;
};

const formatAmount = (raw) => {
  if (!raw) return null;
  return raw.replace(/\s*per\s+(year|annum|month)/i, "").trim();
};

const DeadlineBadge = ({ deadline }) => {
  if (!deadline) return null;
  const days = Math.ceil((new Date(deadline) - new Date()) / 86400000);
  if (days < 0) {
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#94A3B8' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#94A3B8', display: 'inline-block' }} />
        Closed
      </span>
    );
  }
  const isUrgent = days <= 30;
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: isUrgent ? '#EF4444' : '#10B981' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: isUrgent ? '#EF4444' : '#10B981', display: 'inline-block' }} />
      {days}D LEFT
    </span>
  );
};

const getTagStyle = (label) => {
  const l = (label || "").toLowerCase();
  if (l.includes("female")) return { bg: '#FCE7F3', text: '#BE185D' };
  if (l.includes("male")) return { bg: '#DBEAFE', text: '#1D4ED8' };
  if (l.includes("lakh")) return { bg: '#312E81', text: '#fff' };
  if (l.includes("class")) return { bg: '#F1F5F9', text: '#475569' };
  if (["sc", "st", "obc", "minority", "general", "ebc"].includes(l)) return { bg: '#EDE9FE', text: '#6D28D9' };
  if (l.includes("engineer") || l.includes("science") || l.includes("medic") || l.includes("tech")) return { bg: '#E0F2FE', text: '#0369A1' };
  
  const stateWords = ["tamil", "karnataka", "maharashtra", "uttar", "andhra", "telangana", "kerala", "rajasthan", "bihar", "west", "gujarat", "punjab"];
  if (stateWords.some((w) => l.startsWith(w))) return { bg: '#CCFBF1', text: '#0F766E' };
  return { bg: '#F1F5F9', text: '#475569' };
};

const buildTags = (sch) => {
  const e = sch.eligibility || {};
  const tags = [];
  if (e.gender && e.gender !== "All")  tags.push(e.gender === "Female" ? "Female Only" : e.gender === "Male" ? "Male Only" : e.gender);
  if (e.income && e.income !== "All")  tags.push(e.income);
  if (e.grade  && e.grade  !== "All")  tags.push(e.grade);
  if (e.caste  && e.caste  !== "All")  tags.push(e.caste);
  if (e.state  && e.state  !== "All")  tags.push(e.state);
  if (e.course && e.course !== "All" && e.course) tags.push(e.course);
  return tags;
};

export default function Scholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [applied, setApplied]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [pagination, setPagination]     = useState({});
  const [currentPage, setCurrentPage]   = useState(1);
  const [applying, setApplying]         = useState(null);

  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All Categories");
  const [state,    setState]    = useState("State");

  const { isAuthenticated } = useAuthStore();

  useEffect(() => { fetchScholarships(1); window.scrollTo(0, 0); }, []);
  useEffect(() => { if (isAuthenticated) fetchApplied(); }, [isAuthenticated]);

  const fetchScholarships = async (page = 1) => {
    setLoading(true);
    setCurrentPage(page);
    try {
      const params = { page, limit: 10 };
      if (search && search.trim())                params.search   = search.trim();
      if (state    !== "State")                   params.state    = state;
      if (category !== "All Categories")          params.category = category;
      const res = await api.get("/scholarships", { params });
      setScholarships((res.data.data || []).filter(isValid));
      setPagination(res.data.pagination || {});
    } catch {
      setScholarships([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplied = async () => {
    try {
      const res = await api.get("/scholarships/applied");
      setApplied((res.data.data || []).filter(isValid));
    } catch { setApplied([]); }
  };

  const handleSearch = (e) => { e.preventDefault(); fetchScholarships(1); };

  const handleApply = async (sch) => {
    if (!isAuthenticated || applying) return;
    setApplying(sch._id);
    try {
      await api.post(`/scholarships/${sch._id}/apply`);
      await fetchApplied();
    } catch { /* already applied or other */ } finally {
      setApplying(null);
      if (sch.applicationUrl) window.open(sch.applicationUrl, "_blank", "noopener,noreferrer");
    }
  };

  const appliedIds  = new Set(applied.map((s) => s._id));
  const totalPages  = pagination.pages || 1;

  const pageNums = (() => {
    const total = totalPages;
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  })();

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingBottom: 60 }}>
      {/* ── Page header ── */}
      <div style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #7C3AED 100%)', padding: '40px 32px 60px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: '#fff' }}>Scholarships</h1>
          <p style={{ margin: '8px 0 0', fontSize: 16, color: 'rgba(255,255,255,0.85)' }}>
            Browse and apply for scholarships perfectly tailored to your profile
          </p>
        </div>
      </div>

      {/* ── Sticky search bar ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: '#F8FAFC', padding: '0 24px', transform: 'translateY(-26px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, alignItems: 'stretch', height: 52, background: '#fff', padding: 8, borderRadius: 16, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', borderRadius: 10, background: '#F1F5F9' }}>
              <Search size={18} color="#64748B" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search by name, category or state..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: '#0F172A' }}
              />
            </div>
            
            <div style={{ position: 'relative', width: 180 }}>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', height: '100%', appearance: 'none', padding: '0 36px 0 16px', background: '#F1F5F9', borderRadius: 10, border: 'none', outline: 'none', fontSize: 14, color: '#334155', cursor: 'pointer', fontWeight: 500 }}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} color="#64748B" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>

            <div style={{ position: 'relative', width: 180 }}>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                style={{ width: '100%', height: '100%', appearance: 'none', padding: '0 36px 0 16px', background: '#F1F5F9', borderRadius: 10, border: 'none', outline: 'none', fontSize: 14, color: '#334155', cursor: 'pointer', fontWeight: 500 }}
              >
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <ChevronDown size={14} color="#64748B" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>

            <button
              type="submit"
              style={{ padding: '0 24px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '10px 24px 0' }}>
        {/* Count */}
        {!loading && pagination.total > 0 && (
          <p style={{ margin: '0 0 20px', fontSize: 14, color: '#64748B' }}>
            Showing <strong style={{ color: '#0F172A' }}>{scholarships.length}</strong> scholarships
            {pagination.total > scholarships.length ? ` of ${pagination.total}` : ""}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <Loader />
        ) : scholarships.length === 0 ? (
          <div style={{ padding: '80px 0', textAlign: 'center', color: '#94A3B8', fontSize: 15 }}>
            No scholarships found. Try a different search.
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20, marginBottom: 40 }}>
              {scholarships.map((sch) => {
                const isApplied = appliedIds.has(sch._id);
                const amount    = formatAmount(sch.amount);
                const tags      = buildTags(sch);

                return (
                  <div key={sch._id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', transition: 'transform 0.2s, box-shadow 0.2s' }}>
                    {/* Card body */}
                    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1 }}>
                      {/* Provider row + deadline */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                        <p style={{ margin: 0, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8, color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                          {sch.provider || "Government of India"}
                        </p>
                        <DeadlineBadge deadline={sch.deadline} />
                      </div>

                      {/* Title */}
                      <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 800, color: '#0F172A', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                        {sch.title}
                      </h3>

                      {/* Amount */}
                      {amount && /\d/.test(amount) && (
                        <p style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 800, color: '#10B981' }}>
                          {amount.startsWith("₹") ? amount : `₹ ${amount}`}
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', marginLeft: 4 }}>/ year</span>
                        </p>
                      )}

                      {/* Description */}
                      <p style={{ margin: '0 0 16px', fontSize: 13, color: '#64748B', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {sch.description || "No description available."}
                      </p>

                      {/* Tags */}
                      {tags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16, marginTop: 'auto' }}>
                          {tags.slice(0, 4).map((tag, i) => {
                            const s = getTagStyle(tag);
                            return (
                              <span key={`${tag}-${i}`} style={{ background: s.bg, color: s.text, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99 }}>
                                {tag}
                              </span>
                            );
                          })}
                          {tags.length > 4 && (
                            <span style={{ fontSize: 11, color: '#94A3B8', alignSelf: 'center', fontWeight: 600 }}>+{tags.length - 4}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Buttons */}
                    <div style={{ borderTop: '1px solid #F1F5F9', padding: '16px 20px', background: '#FAFAFA', display: 'flex', gap: 10 }}>
                      <a
                        href={sch.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ flex: 1, padding: '10px 0', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#475569', background: '#fff', textAlign: 'center', textDecoration: 'none', display: 'inline-block' }}
                      >
                        Details
                      </a>
                      
                      {isApplied ? (
                        <a
                          href={sch.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ flex: 1, padding: '10px 0', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#fff', background: '#10B981', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                        >
                          <CheckCircle size={16} /> Applied
                        </a>
                      ) : (
                        <button
                          onClick={() => handleApply(sch)}
                          disabled={!isAuthenticated || applying === sch._id}
                          style={{ flex: 1, padding: '10px 0', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#fff', background: '#0F172A', cursor: (!isAuthenticated || applying === sch._id) ? 'not-allowed' : 'pointer', opacity: (!isAuthenticated || applying === sch._id) ? 0.6 : 1 }}
                        >
                          {applying === sch._id ? "Opening…" : "Apply Now"}
                        </button>
                      )}
                    </div>
                    {!isAuthenticated && (
                      <p style={{ margin: '-6px 0 14px', textAlign: 'center', fontSize: 11, color: '#94A3B8', fontWeight: 500, background: '#FAFAFA' }}>Sign in to apply directly</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                <button
                  onClick={() => fetchScholarships(currentPage - 1)}
                  disabled={currentPage <= 1}
                  style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: currentPage <= 1 ? 'not-allowed' : 'pointer', opacity: currentPage <= 1 ? 0.5 : 1 }}
                >
                  <ChevronLeft size={16} />
                </button>
                {pageNums.map((p) => (
                  <button
                    key={p}
                    onClick={() => fetchScholarships(p)}
                    style={{ width: 36, height: 36, borderRadius: 10, border: p === currentPage ? 'none' : '1px solid #E2E8F0', background: p === currentPage ? '#0F172A' : '#fff', color: p === currentPage ? '#fff' : '#475569', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => fetchScholarships(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer', opacity: currentPage >= totalPages ? 0.5 : 1 }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Search, ChevronDown, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import Loader from "../components/common/Loader";

const CLASSES = [
  "All Classes", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
  "Class 11", "Class 12", "Undergraduate", "Postgraduate", "PhD"
];

const GENDERS = [
  "All Genders",
  "Male",
  "Female",
  "Other"
];

const STATES = [
  "State",
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar", "Chandigarh", "Dadra and Nagar Haveli",
  "Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh",
  "Lakshadweep", "Puducherry"
];

const JUNK_RE = /whatsapp|^buddy4study|channel|messaging|telegram|newsletter/i;

const isValid = (s) => {
  if (!s.title || s.title.trim().length === 0) return false;
  if (JUNK_RE.test(s.title)) return false;
  // Make URL and amount checks optional since they are not required fields in the Admin UI
  return true;
};

const formatAmount = (raw) => {
  if (!raw) return null;
  return raw.replace(/\s*per\s+(year|annum|month)/i, "").trim();
};

const DeadlineBadge = ({ deadline }) => {
  if (!deadline) return null;
  const days = Math.ceil((new Date(deadline) - new Date()) / 86400000);
  if (days < 0)
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#9CA3AF' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9CA3AF' }} />
        Closed
      </span>
    );
  const isUrgent = days <= 30;
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: isUrgent ? '#EF4444' : '#10B981' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: isUrgent ? '#EF4444' : '#10B981' }} />
      {days}D LEFT
    </span>
  );
};

const tagStyle = (label) => {
  const l = (label || "").toLowerCase();
  if (l.includes("female")) return { bg: '#FCE7F3', text: '#BE185D' };
  if (l.includes("male")) return { bg: '#DBEAFE', text: '#1D4ED8' };
  if (l.includes("lakh")) return { bg: '#312E81', text: '#fff' };
  if (l.includes("class")) return { bg: '#F3F4F6', text: '#4B5563' };
  if (["sc","st","obc","minority","general","ebc"].includes(l)) return { bg: '#EDE9FE', text: '#6D28D9' };
  if (l.includes("engineer") || l.includes("science") || l.includes("medic") || l.includes("tech")) return { bg: '#E0F2FE', text: '#0369A1' };
  
  const stateWords = ["tamil","karnataka","maharashtra","uttar","andhra","telangana","kerala","rajasthan","bihar","west","gujarat","punjab"];
  if (stateWords.some((w) => l.startsWith(w))) return { bg: '#CCFBF1', text: '#0F766E' };
  
  return { bg: '#F3F4F6', text: '#4B5563' };
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
  const [grade,    setGrade]    = useState("All Classes");
  const [gender,   setGender]   = useState("All Genders");
  const [state,    setState]    = useState("State");

  const [isFocused, setIsFocused] = useState(false);

  const { isAuthenticated } = useAuthStore();

  useEffect(() => { fetchScholarships(1); window.scrollTo(0, 0); }, []);
  useEffect(() => { if (isAuthenticated) fetchApplied(); }, [isAuthenticated]);

  const fetchScholarships = async (page = 1) => {
    setLoading(true);
    setCurrentPage(page);
    try {
      const params = { page, limit: 12 };
      if (search && search.trim())                params.search   = search.trim();
      if (state    !== "State")                   params.state    = state;
      if (grade    !== "All Classes")             params.grade    = grade;
      if (gender   !== "All Genders")             params.gender   = gender;
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
  const totalPages  = Math.max(1, pagination.pages || 1);

  const pageNums = (() => {
    const total = totalPages;
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  })();

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingBottom: 60, paddingTop: 68 }}>

      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #7C3AED 100%)', padding: '36px 32px', marginBottom: 0 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: '#fff' }}>
            Scholarships
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 16, color: 'rgba(255,255,255,0.85)' }}>
            Browse and apply for scholarships tailored to your profile.
          </p>
        </div>
      </div>

      {/* Search Bar section */}
      <div style={{ background: '#fff', borderBottom: '1px solid #F1F5F9', position: 'sticky', top: 68, zIndex: 20 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, height: 44, alignItems: 'stretch' }}>
            
            {/* Search Input */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', background: '#fff', border: isFocused ? '1px solid #6366F1' : '1px solid #E2E8F0', borderRadius: 12, boxShadow: isFocused ? '0 0 0 2px rgba(99,102,241,0.2)' : '0 1px 2px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}>
              <Search size={16} color={isFocused ? "#6366F1" : "#94A3B8"} />
              <input
                type="text"
                placeholder="Search by name, category or state..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: '#0F172A' }}
              />
            </div>

            {/* Grade Select */}
            <div style={{ position: 'relative', width: 160 }}>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                style={{ width: '100%', height: '100%', padding: '0 36px 0 16px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, fontSize: 14, color: '#334155', outline: 'none', appearance: 'none', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
              >
                {CLASSES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} color="#94A3B8" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>

            {/* Gender Select */}
            <div style={{ position: 'relative', width: 160 }}>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{ width: '100%', height: '100%', padding: '0 36px 0 16px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, fontSize: 14, color: '#334155', outline: 'none', appearance: 'none', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
              >
                {GENDERS.map((c) => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} color="#94A3B8" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>

            {/* State Select */}
            <div style={{ position: 'relative', width: 180 }}>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                style={{ width: '100%', height: '100%', padding: '0 36px 0 16px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, fontSize: 14, color: '#334155', outline: 'none', appearance: 'none', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
              >
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <ChevronDown size={14} color="#94A3B8" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>

            {/* Submit Button */}
            <button type="submit" style={{ padding: '0 24px', background: '#6366F1', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#4F46E5'} onMouseOut={e => e.currentTarget.style.background = '#6366F1'}>
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 0' }}>

        {!loading && pagination.total > 0 && (
          <p style={{ margin: '0 0 20px', fontSize: 14, color: '#64748B' }}>
            Showing <span style={{ fontWeight: 600, color: '#0F172A' }}>{scholarships.length}</span> scholarships
            {pagination.total > scholarships.length ? ` of ${pagination.total}` : ""}
          </p>
        )}

        {loading ? (
          <div style={{ paddingTop: 60, display: 'flex', justifyContent: 'center' }}>
            <Loader />
          </div>
        ) : scholarships.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <p style={{ fontSize: 15, color: '#94A3B8' }}>No scholarships found. Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24, marginBottom: 40 }}>
              {scholarships.map((sch) => {
                const isApplied = appliedIds.has(sch._id);
                const amount = formatAmount(sch.amount);
                const tags = buildTags(sch);

                return (
                  <div key={sch._id} style={{ background: '#fff', border: '1px solid #F1F5F9', borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; }}>
                    
                    {/* Card Body */}
                    <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 12 }}>
                        <p style={{ margin: 0, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8, color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {sch.provider || "Government of India"}
                        </p>
                        <DeadlineBadge deadline={sch.deadline} />
                      </div>

                      <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: '#0F172A', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {sch.title}
                      </h3>

                      {amount && /\d/.test(amount) && (
                        <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800, color: '#10B981' }}>
                          {amount.startsWith("₹") ? amount : `₹ ${amount}`}
                          <span style={{ fontSize: 12, fontWeight: 500, color: '#94A3B8', marginLeft: 4 }}>/ year</span>
                        </p>
                      )}

                      <p style={{ margin: '0 0 16px', fontSize: 13, color: '#64748B', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {sch.description || "No description available for this scholarship."}
                      </p>

                      {tags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                          {tags.slice(0, 4).map(tag => {
                            const style = tagStyle(tag);
                            return (
                              <span key={tag} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99, background: style.bg, color: style.text }}>
                                {tag}
                              </span>
                            );
                          })}
                          {tags.length > 4 && (
                            <span style={{ fontSize: 11, color: '#94A3B8', marginLeft: 2, alignSelf: 'center', fontWeight: 600 }}>+{tags.length - 4}</span>
                          )}
                        </div>
                      )}
                      <div style={{ flex: 1 }} />
                    </div>

                    {/* Card Actions */}
                    <div style={{ borderTop: '1px solid #F8FAFC', padding: '16px 20px', display: 'flex', gap: 10, background: '#F8FAFC' }}>
                      <a href={sch.applicationUrl} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '10px 0', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#475569', textAlign: 'center', textDecoration: 'none', background: '#fff', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#F1F5F9'} onMouseOut={e => e.currentTarget.style.background = '#fff'}>
                        Details
                      </a>
                      {isApplied ? (
                        <div style={{ flex: 1, padding: '10px 0', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#fff', textAlign: 'center', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          <CheckCircle size={16} /> Applied
                        </div>
                      ) : (
                        <button
                          onClick={() => handleApply(sch)}
                          disabled={!isAuthenticated || applying === sch._id}
                          style={{ flex: 1, padding: '10px 0', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#fff', textAlign: 'center', background: '#0F172A', cursor: (!isAuthenticated || applying === sch._id) ? 'not-allowed' : 'pointer', opacity: (!isAuthenticated || applying === sch._id) ? 0.6 : 1, transition: 'background 0.2s' }}
                          onMouseOver={e => { if(isAuthenticated && applying !== sch._id) e.currentTarget.style.background = '#334155'; }}
                          onMouseOut={e => { if(isAuthenticated && applying !== sch._id) e.currentTarget.style.background = '#0F172A'; }}
                        >
                          {applying === sch._id ? "Opening…" : "Apply Now"}
                        </button>
                      )}
                    </div>
                    {!isAuthenticated && (
                      <div style={{ background: '#F8FAFC', paddingBottom: 12, textAlign: 'center' }}>
                         <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>Sign in to apply</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <button
                  onClick={() => fetchScholarships(currentPage - 1)}
                  disabled={currentPage <= 1}
                  style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', cursor: currentPage <= 1 ? 'not-allowed' : 'pointer', opacity: currentPage <= 1 ? 0.5 : 1, transition: 'background 0.2s' }}
                  onMouseOver={e => { if(currentPage > 1) e.currentTarget.style.background = '#F8FAFC'; }}
                  onMouseOut={e => { if(currentPage > 1) e.currentTarget.style.background = '#fff'; }}
                >
                  <ChevronLeft size={16} />
                </button>
                {pageNums.map((p) => (
                  <button
                    key={p}
                    onClick={() => fetchScholarships(p)}
                    style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, border: p === currentPage ? 'none' : '1px solid #E2E8F0', background: p === currentPage ? '#0F172A' : '#fff', color: p === currentPage ? '#fff' : '#64748B', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={e => { if(p !== currentPage) e.currentTarget.style.background = '#F8FAFC'; }}
                    onMouseOut={e => { if(p !== currentPage) e.currentTarget.style.background = '#fff'; }}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => fetchScholarships(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer', opacity: currentPage >= totalPages ? 0.5 : 1, transition: 'background 0.2s' }}
                  onMouseOver={e => { if(currentPage < totalPages) e.currentTarget.style.background = '#F8FAFC'; }}
                  onMouseOut={e => { if(currentPage < totalPages) e.currentTarget.style.background = '#fff'; }}
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

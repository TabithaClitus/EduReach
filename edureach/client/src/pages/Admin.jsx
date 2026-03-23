import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CLASSES = [
  "All Classes", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
  "Class 11", "Class 12", "Undergraduate", "Postgraduate", "PhD"
];

const GENDERS = [
  "All Genders", "Male", "Female", "Other"
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

// ── Shared helpers ────────────────────────────────────────────────────────────
function Avatar({ initials, bg = '#EDE9FE', color = '#7C3AED', size = 40 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: size * 0.35, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function Badge({ label, color }) {
  const map = {
    student:   { bg: '#DBEAFE', text: '#1D4ED8' },
    mentor:    { bg: '#D1FAE5', text: '#065F46' },
    admin:     { bg: '#EDE9FE', text: '#7C3AED' },
    active:    { bg: '#D1FAE5', text: '#065F46' },
    suspended: { bg: '#FEE2E2', text: '#991B1B' },
    approved:  { bg: '#D1FAE5', text: '#065F46' },
    pending:   { bg: '#FEF3C7', text: '#92400E' },
    rejected:  { bg: '#FEE2E2', text: '#991B1B' },
  };
  const key = (color || label || '').toLowerCase();
  const s = map[key] || { bg: '#F1F5F9', text: '#475569' };
  return (
    <span style={{ background: s.bg, color: s.text, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, textTransform: 'capitalize' }}>
      {label}
    </span>
  );
}

// ── Hard-coded data ───────────────────────────────────────────────────────────
const USERS = [
  { id: 1, name: 'Aanya Singh',     email: 'aanya@example.com',  role: 'student', status: 'active',    joined: 'Jan 12, 2026' },
  { id: 2, name: 'Rahul Verma',     email: 'rahul@example.com',  role: 'student', status: 'active',    joined: 'Jan 18, 2026' },
  { id: 3, name: 'Priya Nair',      email: 'priya@example.com',  role: 'mentor',  status: 'active',    joined: 'Dec 5, 2025'  },
  { id: 4, name: 'Meera Patel',     email: 'meera@example.com',  role: 'student', status: 'suspended', joined: 'Feb 2, 2026'  },
  { id: 5, name: 'Arjun Sharma',    email: 'arjun@example.com',  role: 'mentor',  status: 'active',    joined: 'Nov 20, 2025' },
  { id: 6, name: 'Sneha Roy',       email: 'sneha@example.com',  role: 'student', status: 'active',    joined: 'Mar 1, 2026'  },
  { id: 7, name: 'Vikram Reddy',    email: 'vikram@example.com', role: 'student', status: 'active',    joined: 'Feb 14, 2026' },
  { id: 8, name: 'EduReach Admin',  email: 'admin@edureach.in',  role: 'admin',   status: 'active',    joined: 'Oct 1, 2025'  },
];

const MENTORS_DATA = [
  { id: 1, name: 'Arjun Sharma',  email: 'arjun@example.com',  subjects: ['Mathematics', 'Physics'],  rating: 4.8, sessions: 92,  status: 'approved' },
  { id: 2, name: 'Priya Nair',    email: 'priya@example.com',  subjects: ['Science', 'Biology'],       rating: 4.9, sessions: 115, status: 'approved' },
  { id: 3, name: 'Suresh Babu',   email: 'suresh@example.com', subjects: ['Mathematics', 'CS'],        rating: 4.7, sessions: 64,  status: 'pending'  },
  { id: 4, name: 'Meena Reddy',   email: 'meena@example.com',  subjects: ['English', 'History'],       rating: 4.6, sessions: 78,  status: 'pending'  },
  { id: 5, name: 'Ravi Kumar',    email: 'ravi@example.com',   subjects: ['Mathematics', 'Science'],   rating: 4.5, sessions: 43,  status: 'approved' },
  { id: 6, name: 'Fatima Sheikh', email: 'fatima@example.com', subjects: ['Chemistry', 'Biology'],     rating: 4.9, sessions: 57,  status: 'rejected' },
];

// ── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab() {
  const recentUsers = [...USERS].sort((a, b) => new Date(b.joined) - new Date(a.joined)).slice(0, 5);
  const pendingMentors = MENTORS_DATA.filter(m => m.status === 'pending');

  const stats = [
    { icon: '👥', label: 'Total Users',          value: 124, bg: '#EDE9FE', color: '#7C3AED' },
    { icon: '🎓', label: 'Students',              value: 98,  bg: '#DBEAFE', color: '#2563EB' },
    { icon: '👨‍🏫', label: 'Mentors',              value: 12,  bg: '#D1FAE5', color: '#059669' },
    { icon: '📚', label: 'Active Sessions',       value: 34,  bg: '#FEF3C7', color: '#D97706' },
    { icon: '📝', label: 'Quizzes Taken',         value: 267, bg: '#FCE7F3', color: '#DB2777' },
    { icon: '🏆', label: 'Scholarships Applied',  value: 45,  bg: '#E0F2FE', color: '#0284C7' },
  ];

  // Bar chart data (Mon–Sun, students vs mentors activity)
  const chartData = [
    { day: 'Mon', students: 62, mentors: 8  },
    { day: 'Tue', students: 78, mentors: 11 },
    { day: 'Wed', students: 55, mentors: 6  },
    { day: 'Thu', students: 90, mentors: 14 },
    { day: 'Fri', students: 84, mentors: 12 },
    { day: 'Sat', students: 40, mentors: 5  },
    { day: 'Sun', students: 30, mentors: 3  },
  ];
  const maxVal = Math.max(...chartData.map(d => d.students + d.mentors));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #F1F5F9', borderRadius: 14, padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{s.icon}</div>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B', fontWeight: 500 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Recent Registrations */}
        <div style={{ background: '#fff', border: '1px solid #F1F5F9', borderRadius: 14, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <p style={{ margin: '0 0 16px', fontWeight: 700, fontSize: 15, color: '#0F172A' }}>Recent Registrations</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentUsers.map(u => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar initials={u.name.split(' ').map(n => n[0]).join('').slice(0, 2)} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{u.name}</p>
                  <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>Joined {u.joined}</p>
                </div>
                <Badge label={u.role} />
              </div>
            ))}
          </div>
        </div>

        {/* Pending Mentor Approvals */}
        <div style={{ background: '#fff', border: '1px solid #F1F5F9', borderRadius: 14, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <p style={{ margin: '0 0 16px', fontWeight: 700, fontSize: 15, color: '#0F172A' }}>
            Pending Mentor Approvals
            {pendingMentors.length > 0 && <span style={{ marginLeft: 8, background: '#FEF3C7', color: '#D97706', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>{pendingMentors.length}</span>}
          </p>
          {pendingMentors.length === 0 ? (
            <p style={{ color: '#94A3B8', fontSize: 13 }}>No pending approvals 🎉</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pendingMentors.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar initials={m.name.split(' ').map(n => n[0]).join('').slice(0, 2)} bg='#D1FAE5' color='#059669' />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{m.name}</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>{m.subjects.join(', ')}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={{ padding: '4px 10px', background: '#D1FAE5', color: '#065F46', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>✅</button>
                    <button style={{ padding: '4px 10px', background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>❌</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activity Chart */}
      <div style={{ background: '#fff', border: '1px solid #F1F5F9', borderRadius: 14, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#0F172A' }}>Platform Activity — This Week</p>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: '#6366F1' }} /><span style={{ fontSize: 12, color: '#64748B' }}>Students</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: '#10B981' }} /><span style={{ fontSize: 12, color: '#64748B' }}>Mentors</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 140 }}>
          {chartData.map(d => (
            <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', height: `${(d.students / maxVal) * 110}px`, background: '#6366F1', borderRadius: '4px 4px 0 0', minHeight: 4 }} />
                <div style={{ width: '100%', height: `${(d.mentors / maxVal) * 110}px`, background: '#10B981', borderRadius: '4px 4px 0 0', minHeight: 2 }} />
              </div>
              <span style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ── Users Tab ─────────────────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/auth/admin/users');
        setUsers(data.data || []);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filtered = users.filter(u =>
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Search */}
      <div style={{ background: '#fff', border: '1px solid #F1F5F9', borderRadius: 14, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <input
          placeholder="🔍  Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '10px 14px', fontSize: 14, border: '1px solid #E2E8F0', borderRadius: 10, outline: 'none', background: '#F8FAFC', color: '#0F172A', boxSizing: 'border-box' }}
          onFocus={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.background = '#fff'; }}
          onBlur={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8FAFC'; }}
        />
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #F1F5F9', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 2fr 1fr 2fr 1.2fr', padding: '12px 20px', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
          {['Name', 'Email', 'Role', 'Scholarships', 'Joined'].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>Loading users...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>No users found.</div>
        ) : (
          filtered.map(u => (
            <div key={u._id}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 2fr 1fr 2fr 1.2fr', padding: '14px 20px', borderBottom: '1px solid #F8FAFC', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar initials={(u.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2)} size={34} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{u.name || 'Unknown User'}</span>
                </div>
                <span style={{ fontSize: 13, color: '#64748B' }}>{u.email}</span>
                <Badge label={u.role || 'student'} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(u.appliedScholarships || []).length === 0 ? (
                    <span style={{ fontSize: 12, color: '#94A3B8' }}>None</span>
                  ) : (
                    u.appliedScholarships.slice(0, 2).map((sch) => (
                      <span key={sch._id} style={{ background: '#EFF6FF', color: '#1D4ED8', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 99 }}>
                        {sch.title}
                      </span>
                    ))
                  )}
                  {(u.appliedScholarships || []).length > 2 && (
                    <span style={{ fontSize: 11, color: '#64748B' }}>+{u.appliedScholarships.length - 2}</span>
                  )}
                </div>
                <span style={{ fontSize: 12, color: '#94A3B8' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Mentors Tab ───────────────────────────────────────────────────────────────
function MentorsTab() {
  const [mentors, setMentors] = useState(MENTORS_DATA);
  const [filter, setFilter] = useState('all');

  const updateStatus = (id, status) => {
    setMentors(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  };

  const visible = filter === 'all' ? mentors : mentors.filter(m => m.status === filter);

  const filterBtn = (label, key) => (
    <button key={key} onClick={() => setFilter(key)}
      style={{ padding: '7px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: filter === key ? '#6366F1' : '#F1F5F9', color: filter === key ? '#fff' : '#64748B', transition: 'all 0.15s' }}>
      {label}
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {filterBtn('All', 'all')}
        {filterBtn('Pending', 'pending')}
        {filterBtn('Approved', 'approved')}
        {filterBtn('Rejected', 'rejected')}
        <span style={{ marginLeft: 'auto', fontSize: 13, color: '#94A3B8' }}>Showing {visible.length} mentor{visible.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {visible.map(m => (
          <div key={m.id} style={{ background: '#fff', border: '1px solid #F1F5F9', borderRadius: 14, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar initials={m.name.split(' ').map(n => n[0]).join('').slice(0, 2)} bg='#D1FAE5' color='#065F46' size={44} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#0F172A' }}>{m.name}</p>
                <p style={{ margin: 0, fontSize: 12, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email}</p>
              </div>
              <Badge label={m.status} />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {m.subjects.map(s => (
                <span key={s} style={{ background: '#EFF6FF', color: '#2563EB', fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 99 }}>{s}</span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#F59E0B', fontSize: 14 }}>★</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{m.rating}</span>
              </div>
              <div style={{ fontSize: 13, color: '#64748B' }}>{m.sessions} sessions</div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button onClick={() => updateStatus(m.id, 'approved')} disabled={m.status === 'approved'}
                style={{ flex: 1, padding: '8px', background: m.status === 'approved' ? '#F1F5F9' : '#D1FAE5', color: m.status === 'approved' ? '#94A3B8' : '#065F46', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: m.status === 'approved' ? 'default' : 'pointer' }}>
                ✅ Approve
              </button>
              <button onClick={() => updateStatus(m.id, 'rejected')} disabled={m.status === 'rejected'}
                style={{ flex: 1, padding: '8px', background: m.status === 'rejected' ? '#F1F5F9' : '#FEE2E2', color: m.status === 'rejected' ? '#94A3B8' : '#991B1B', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: m.status === 'rejected' ? 'default' : 'pointer' }}>
                ❌ Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScholarshipsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    provider: '',
    amount: '',
    deadline: '',
    description: '',
    applicationUrl: '',
    state: '',
    caste: '',
    income: '',
    course: '',
    grade: '',
    gender: '',
  });

  const loadScholarships = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/scholarships', { params: { page: 1, limit: 100 } });
      setItems(data.data || []);
    } catch {
      setItems([]);
      setError('Failed to load scholarships');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScholarships();
  }, []);

  const [editingId, setEditingId] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onEdit = (sch) => {
    setEditingId(sch._id);
    setForm({
      title: sch.title || '',
      provider: sch.provider || '',
      amount: sch.amount || '',
      deadline: sch.deadline ? new Date(sch.deadline).toISOString().split('T')[0] : '',
      description: sch.description || '',
      applicationUrl: sch.applicationUrl || '',
      state: sch.eligibility?.state || '',
      caste: sch.eligibility?.caste || '',
      income: sch.eligibility?.income || '',
      course: sch.eligibility?.course || '',
      grade: sch.eligibility?.grade || '',
      gender: sch.eligibility?.gender || '',
    });
    setError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      title: '', provider: '', amount: '', deadline: '', description: '',
      applicationUrl: '', state: '', caste: '', income: '', course: '', grade: '', gender: ''
    });
    setError('');
  };

  const onCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const payload = {
        title: form.title.trim(),
        provider: form.provider.trim(),
        amount: form.amount.trim(),
        deadline: form.deadline || undefined,
        description: form.description.trim(),
        applicationUrl: form.applicationUrl.trim(),
        eligibility: {
          state: form.state.trim(),
          caste: form.caste.trim(),
          income: form.income.trim(),
          course: form.course.trim(),
          grade: form.grade.trim(),
          gender: form.gender.trim(),
        },
      };

      if (editingId) {
        await api.put(`/scholarships/${editingId}`, payload);
        setEditingId(null);
      } else {
        await api.post('/scholarships', payload);
      }

      setForm({
        title: '',
        provider: '',
        amount: '',
        deadline: '',
        description: '',
        applicationUrl: '',
        state: '',
        caste: '',
        income: '',
        course: '',
        grade: '',
        gender: '',
      });

      await loadScholarships();
    } catch (err) {
      setError(err?.response?.data?.message || `Failed to ${editingId ? 'update' : 'add'} scholarship`);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    setDeletingId(id);
    setError('');
    try {
      await api.delete(`/scholarships/${id}`);
      await loadScholarships();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete scholarship');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
      <div style={{ background: '#fff', border: '1px solid #F1F5F9', borderRadius: 14, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', minWidth: 0, maxWidth: '100%' }}>
        <p style={{ margin: '0 0 16px', fontWeight: 700, fontSize: 16, color: '#0F172A' }}>
          {editingId ? 'Edit Scholarship' : 'Add Scholarship'}
        </p>
        <form onSubmit={onCreate} style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
          <input name="title" value={form.title} onChange={onChange} placeholder="Title*" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }} />
          <input name="provider" value={form.provider} onChange={onChange} placeholder="Provider" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <input name="amount" value={form.amount} onChange={onChange} placeholder="Amount" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }} />
            <input name="deadline" type="date" value={form.deadline} onChange={onChange} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }} />
          </div>
          <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" rows={3} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0', resize: 'vertical' }} />
          <input name="applicationUrl" value={form.applicationUrl} onChange={onChange} placeholder="Application URL" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <select name="state" value={form.state} onChange={onChange} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', color: '#334155', appearance: 'none' }}>
              <option value="">Select State</option>
              {STATES.filter(s => s !== "State").map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select name="grade" value={form.grade} onChange={onChange} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', color: '#334155', appearance: 'none' }}>
              <option value="">Select Class/Grade</option>
              {CLASSES.filter(c => c !== "All Classes").map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select name="gender" value={form.gender} onChange={onChange} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', color: '#334155', appearance: 'none' }}>
              <option value="">Select Gender</option>
              {GENDERS.filter(g => g !== "All Genders").map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <input name="caste" value={form.caste} onChange={onChange} placeholder="Caste" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }} />
            <input name="income" value={form.income} onChange={onChange} placeholder="Income Limit" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }} />
            <input name="course" value={form.course} onChange={onChange} placeholder="Course" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }} />
          </div>
          {error && <p style={{ margin: 0, fontSize: 12, color: '#B91C1C' }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" disabled={saving} style={{ flex: 1, padding: '10px 14px', border: 'none', borderRadius: 8, background: '#2563EB', color: '#fff', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving...' : (editingId ? 'Update Scholarship' : 'Add Scholarship')}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} disabled={saving} style={{ padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: 8, background: '#fff', color: '#475569', fontWeight: 700, cursor: 'pointer' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ background: '#fff', border: '1px solid #F1F5F9', borderRadius: 14, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', minWidth: 0, maxWidth: '100%' }}>
        <p style={{ margin: '0 0 16px', fontWeight: 700, fontSize: 16, color: '#0F172A' }}>Existing Scholarships</p>
        {loading ? (
          <p style={{ fontSize: 13, color: '#94A3B8' }}>Loading scholarships...</p>
        ) : items.length === 0 ? (
          <p style={{ fontSize: 13, color: '#94A3B8' }}>No scholarships found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 560, overflowY: 'auto', overflowX: 'hidden', paddingRight: 4 }}>
            {items.map((sch) => (
              <div key={sch._id} style={{ border: '1px solid #E2E8F0', borderRadius: 10, padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sch.title}</p>
                  <p style={{ margin: '3px 0 0', fontSize: 12, color: '#64748B' }}>{sch.provider || 'Provider not set'}</p>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => onEdit(sch)}
                    style={{ padding: '6px 10px', flexShrink: 0, minWidth: 60, border: 'none', borderRadius: 8, background: '#EFF6FF', color: '#1D4ED8', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(sch._id)}
                    disabled={deletingId === sch._id}
                    style={{ padding: '6px 10px', flexShrink: 0, minWidth: 65, border: 'none', borderRadius: 8, background: '#FEE2E2', color: '#991B1B', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', opacity: deletingId === sch._id ? 0.7 : 1 }}
                  >
                    {deletingId === sch._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Reports Tab ───────────────────────────────────────────────────────────────
function ReportsTab() {
  const engagement = [
    { subject: 'Mathematics', pct: 78 },
    { subject: 'Science',     pct: 61 },
    { subject: 'English',     pct: 89 },
    { subject: 'Physics',     pct: 70 },
    { subject: 'History',     pct: 54 },
  ];

  const quizzes = [
    { name: 'Class 9 Algebra Basics',    attempts: 42, avgScore: 74, passRate: 81 },
    { name: 'Newton\'s Laws Quiz',        attempts: 37, avgScore: 68, passRate: 70 },
    { name: 'Chemical Reactions',        attempts: 29, avgScore: 82, passRate: 90 },
    { name: 'English Grammar Test',      attempts: 55, avgScore: 77, passRate: 85 },
    { name: 'Indian Freedom Movement',   attempts: 21, avgScore: 63, passRate: 62 },
  ];

  const topStudents = [
    { rank: 1, name: 'Aanya Singh',  progress: 94, sessions: 12, badge: '🏆' },
    { rank: 2, name: 'Rahul Verma',  progress: 88, sessions: 9,  badge: '🥈' },
    { rank: 3, name: 'Sneha Roy',    progress: 81, sessions: 7,  badge: '🥉' },
    { rank: 4, name: 'Vikram Reddy', progress: 75, sessions: 6,  badge: '⭐' },
    { rank: 5, name: 'Meera Patel',  progress: 70, sessions: 5,  badge: '⭐' },
  ];

  const card = (title, children) => (
    <div style={{ background: '#fff', border: '1px solid #F1F5F9', borderRadius: 14, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <p style={{ margin: '0 0 16px', fontWeight: 700, fontSize: 15, color: '#0F172A' }}>{title}</p>
      {children}
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

      {/* 1. Student Engagement */}
      {card('📊 Student Engagement by Subject',
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {engagement.map(e => (
            <div key={e.subject}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: '#334155', fontWeight: 500 }}>{e.subject}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#6366F1' }}>{e.pct}%</span>
              </div>
              <div style={{ background: '#F1F5F9', borderRadius: 99, height: 8, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${e.pct}%`, background: `linear-gradient(90deg, #6366F1, #8B5CF6)`, borderRadius: 99, transition: 'width 0.6s ease' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Quiz Performance */}
      {card('📝 Quiz Performance',
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Quiz', 'Attempts', 'Avg Score', 'Pass Rate'].map(h => (
                  <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.4, borderBottom: '1px solid #F1F5F9' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {quizzes.map((q, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F8FAFC' }}>
                  <td style={{ padding: '10px 10px', color: '#334155', fontWeight: 500, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.name}</td>
                  <td style={{ padding: '10px 10px', color: '#64748B' }}>{q.attempts}</td>
                  <td style={{ padding: '10px 10px', color: '#2563EB', fontWeight: 700 }}>{q.avgScore}%</td>
                  <td style={{ padding: '10px 10px' }}>
                    <span style={{ background: q.passRate >= 80 ? '#D1FAE5' : q.passRate >= 65 ? '#FEF3C7' : '#FEE2E2', color: q.passRate >= 80 ? '#065F46' : q.passRate >= 65 ? '#92400E' : '#991B1B', padding: '2px 8px', borderRadius: 99, fontSize: 12, fontWeight: 700 }}>
                      {q.passRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. Mentorship Stats */}
      {card('🤝 Mentorship Stats',
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Total Matches', value: 34, color: '#6366F1', bg: '#EDE9FE' },
              { label: 'Active',        value: 28, color: '#10B981', bg: '#D1FAE5' },
              { label: 'Completed',     value: 6,  color: '#F59E0B', bg: '#FEF3C7' },
              { label: 'Avg Sessions',  value: '8.5', color: '#0284C7', bg: '#E0F2FE' },
            ].map(s => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: '12px 14px' }}>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</p>
                <p style={{ margin: 0, fontSize: 12, color: '#475569', fontWeight: 500 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Top Students */}
      {card('🏆 Top Performing Students',
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {topStudents.map(s => (
            <div key={s.rank} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{s.badge}</span>
              <Avatar initials={s.name.split(' ').map(n => n[0]).join('').slice(0, 2)} size={34} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{s.name}</span>
                  <span style={{ fontSize: 12, color: '#6366F1', fontWeight: 700 }}>{s.progress}%</span>
                </div>
                <div style={{ background: '#F1F5F9', borderRadius: 99, height: 5, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.progress}%`, background: '#6366F1', borderRadius: 99 }} />
                </div>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>{s.sessions} sessions</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

// ── Main Admin Component ──────────────────────────────────────────────────────
export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const activeTab = params.get('tab') || 'overview';

  const tabs = [
    { key: 'overview', label: 'Overview',  icon: '🏠' },
    { key: 'users',    label: 'Users',     icon: '👥' },
    { key: 'scholarships', label: 'Scholarships', icon: '🎓' },
    { key: 'mentors',  label: 'Mentors',   icon: '👨‍🏫' },
    { key: 'reports',  label: 'Reports',   icon: '📊' },
  ];

  const adminName = user?.name || 'Admin';

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: 68, paddingBottom: 48 }}>

      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #7C3AED 100%)', padding: '36px 32px', marginBottom: 32 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#fff' }}>
            👋 Welcome, {adminName}
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 15, color: 'rgba(255,255,255,0.75)' }}>
            EduReach Platform Overview
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, background: '#fff', borderRadius: 12, padding: 6, border: '1px solid #F1F5F9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', width: 'fit-content' }}>
          {tabs.map(t => (
            <button key={t.key}
              onClick={() => navigate(t.key === 'overview' ? '/admin' : `/admin?tab=${t.key}`)}
              style={{
                padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                background: activeTab === t.key ? '#6366F1' : 'transparent',
                color: activeTab === t.key ? '#fff' : '#64748B',
                transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'users'    && <UsersTab />}
        {activeTab === 'scholarships' && <ScholarshipsTab />}
        {activeTab === 'mentors'  && <MentorsTab />}
        {activeTab === 'reports'  && <ReportsTab />}
      </div>
    </div>
  );
}

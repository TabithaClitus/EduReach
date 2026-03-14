import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useRegisterSW } from 'virtual:pwa-register/react';
import useAuthStore from './store/authStore';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import useOnlineStatus from './hooks/useOnlineStatus';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import Learning from './pages/Learning';
import ClassSelection from './pages/learning/ClassSelection';
import SubjectPage from './pages/learning/SubjectPage';
import ChapterPage from './pages/learning/ChapterPage';
import LessonPage from './pages/learning/LessonPage';
import Scholarships from './pages/Scholarships';
import Mentoring from './pages/Mentoring';
import MentoringChat from './pages/MentoringChat';
import SpeechTherapy from './pages/SpeechTherapy';
import MentalHealth from './pages/MentalHealth';
import StudyPlan from './pages/StudyPlan';
import CourseDetail from './pages/CourseDetail';
import Quiz from './pages/Quiz';
import QuizTake from './pages/QuizTake';
import QuizResults from './pages/QuizResults';
import MentorDashboard from './pages/MentorDashboard';
import StudentDetail from './pages/StudentDetail';
import Admin from './pages/Admin';
import AiDoubtSolver from './pages/AiDoubtSolver';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Keep runtime crash details visible in console for debugging.
    console.error('App render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'Inter, sans-serif' }}>
          <div style={{ maxWidth: 760, width: '100%', background: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', padding: 24 }}>
            <h2 style={{ margin: 0, fontSize: 22, color: '#0F172A' }}>App crashed while rendering</h2>
            <p style={{ marginTop: 8, fontSize: 14, color: '#64748B' }}>
              A runtime error occurred. This is now shown instead of a blank screen.
            </p>
            <pre style={{ marginTop: 14, background: '#0F172A', color: '#E2E8F0', padding: 12, borderRadius: 10, overflow: 'auto', fontSize: 12, lineHeight: 1.45 }}>
              {String(this.state.error?.message || this.state.error || 'Unknown error')}
            </pre>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{ marginTop: 14, background: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: 10, padding: '10px 16px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppLayout = () => {
  const { user, token, isAuthenticated } = useAuthStore();
  const isOnline = useOnlineStatus();
  const hasSession = isAuthenticated || Boolean(user && token);

  useRegisterSW({ immediate: true });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <style>{`@keyframes offline-dot-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .45; transform: scale(.88); } }`}</style>
      <ScrollToTop />
      <Navbar />
      {!isOnline && (
        <div
          style={{
            position: 'fixed',
            top: 68,
            left: 0,
            right: 0,
            zIndex: 110,
            background: '#374151',
            color: '#FFFFFF',
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontSize: 13,
            fontWeight: 500,
            boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#93C5FD', animation: 'offline-dot-pulse 1.2s ease-in-out infinite' }} />
          <span>📡 You're offline — showing cached content</span>
        </div>
      )}
      <main className="flex-1 pt-[68px]">
        <Routes>
          <Route
            path="/"
            element={
              hasSession ? (
                user?.role === 'mentor' ? (
                  <Navigate to="/mentor-dashboard" replace />
                ) : user?.role === 'admin' ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              ) : (
                <Landing />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/learning" element={<ProtectedRoute><ClassSelection /></ProtectedRoute>} />
          <Route path="/learning/browse" element={<ProtectedRoute><Learning /></ProtectedRoute>} />
          <Route path="/learning/class/:classId" element={<ProtectedRoute><SubjectPage /></ProtectedRoute>} />
          <Route path="/learning/class/:classId/subject/:subjectId" element={<ProtectedRoute><ChapterPage /></ProtectedRoute>} />
          <Route path="/learning/class/:classId/subject/:subjectId/chapter/:chapterId" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
          <Route path="/learning/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
          <Route path="/scholarships" element={<ProtectedRoute><Scholarships /></ProtectedRoute>} />
          <Route path="/mentoring" element={<ProtectedRoute><Mentoring /></ProtectedRoute>} />
          <Route path="/mentoring/chat/:chatId" element={<ProtectedRoute><MentoringChat /></ProtectedRoute>} />
          <Route path="/speech-therapy" element={<ProtectedRoute><SpeechTherapy /></ProtectedRoute>} />
          <Route path="/mental-health" element={<ProtectedRoute><MentalHealth /></ProtectedRoute>} />
          <Route path="/study-plan" element={<ProtectedRoute><StudyPlan /></ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
          <Route path="/quiz/results/:id" element={<ProtectedRoute><QuizResults /></ProtectedRoute>} />
          <Route path="/quiz/:id" element={<ProtectedRoute><QuizTake /></ProtectedRoute>} />
          <Route path="/mentor-dashboard" element={<ProtectedRoute><MentorDashboard /></ProtectedRoute>} />
          <Route path="/mentor/student/:id" element={<ProtectedRoute><StudentDetail /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/doubt-solver" element={<ProtectedRoute><AiDoubtSolver /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AppErrorBoundary>
      <Router>
        <AppLayout />
      </Router>
    </AppErrorBoundary>
  );
}

export default App;

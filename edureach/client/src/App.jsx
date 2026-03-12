import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuthStore from './store/authStore';
import { useEffect } from 'react';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

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

const AppLayout = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const hideFooterPaths = ['/login', '/register'];
  const showFooter = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 pt-[68px]">
        <Routes>
          <Route path="/" element={
            isAuthenticated ? (
              user?.role === 'mentor' ? <Navigate to="/mentor-dashboard" replace /> :
              user?.role === 'admin'  ? <Navigate to="/admin" replace /> :
              <Navigate to="/dashboard" replace />
            ) : <Landing />
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning"
            element={
              <ProtectedRoute>
                <ClassSelection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning/browse"
            element={
              <ProtectedRoute>
                <Learning />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning/class/:classId"
            element={
              <ProtectedRoute>
                <SubjectPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning/class/:classId/subject/:subjectId"
            element={
              <ProtectedRoute>
                <ChapterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning/class/:classId/subject/:subjectId/chapter/:chapterId"
            element={
              <ProtectedRoute>
                <LessonPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning/:id"
            element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scholarships"
            element={
              <ProtectedRoute>
                <Scholarships />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentoring"
            element={
              <ProtectedRoute>
                <Mentoring />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentoring/chat/:chatId"
            element={
              <ProtectedRoute>
                <MentoringChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/speech-therapy"
            element={
              <ProtectedRoute>
                <SpeechTherapy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mental-health"
            element={
              <ProtectedRoute>
                <MentalHealth />
              </ProtectedRoute>
            }
          />
          <Route
            path="/study-plan"
            element={
              <ProtectedRoute>
                <StudyPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/results/:id"
            element={
              <ProtectedRoute>
                <QuizResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:id"
            element={
              <ProtectedRoute>
                <QuizTake />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor-dashboard"
            element={
              <ProtectedRoute>
                <MentorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/student/:id"
            element={
              <ProtectedRoute>
                <StudentDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;

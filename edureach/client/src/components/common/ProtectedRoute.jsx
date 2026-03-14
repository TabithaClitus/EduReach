import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, token } = useAuthStore();
  const location = useLocation();
  const hasSession = isAuthenticated || Boolean(user && token);

  if (!hasSession) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole, userOnly }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to={requiredRole === 'admin' ? '/admin-login' : '/login'} replace />;
  }
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  if (userOnly && user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  return children;
}

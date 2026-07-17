import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// requireRole: 'admin' | 'employee' | null (any authenticated user)
const ProtectedRoute = ({ children, requireRole = null }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (requireRole && user.role !== requireRole) {
    // Redirect to their own portal
    return <Navigate to={user.role === 'admin' ? '/app' : '/portal'} replace />;
  }

  return children;
};

export default ProtectedRoute;

import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ isAuthenticated, user, requiredRole }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;

// src/components/ProtectedRoute.jsx
// Redirects to /login if the user is not authenticated

import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="spinner">Loading…</div>;

  return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} replace />;
};

export default ProtectedRoute;

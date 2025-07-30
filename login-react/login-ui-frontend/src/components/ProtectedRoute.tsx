
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { user, token } = useAuth();

  // If there's no token or user, redirect to the login page
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // If logged in, render the page the user was trying to access
  return <Outlet />;
};

export default ProtectedRoute;
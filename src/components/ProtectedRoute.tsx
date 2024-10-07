import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User as UserType } from '../types/userTypes'; // Rename to UserType to avoid conflicts

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !(user as UserType).isAdmin) { // Type assertion to UserType
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

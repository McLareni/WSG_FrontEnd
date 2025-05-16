import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Loader } from '../components/UI/Loader/Loader';
import { useTranslation } from 'react-i18next'; // Додано імпорт

const ProtectedRoute = ({ children, requiredRole }) => {
  const { i18n } = useTranslation(); // Додано хук
  const [authChecked, setAuthChecked] = useState(false);
  const { session, user, isLoading } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      setAuthChecked(true);
    }
  }, [isLoading, i18n.language]); // Додано залежність від мови

  if (isLoading || !authChecked) {
    return (
      <div className="fullscreen-loader">
        <Loader />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user?.role === 'authenticated' 
    ? (user.email.includes('@teacher.') ? 'teacher' : 'student')
    : user?.role;

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default React.memo(ProtectedRoute);
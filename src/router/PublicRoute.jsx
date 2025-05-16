import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Loader } from '../components/UI/Loader/Loader';
import { useTranslation } from 'react-i18next'; // Додано імпорт

const PublicRoute = ({ children }) => {
  const { i18n } = useTranslation(); // Додано хук
  const [authChecked, setAuthChecked] = useState(false);
  const { session, isLoading } = useAuthStore();
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

  if (session) {
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  return children;
};

export default React.memo(PublicRoute);
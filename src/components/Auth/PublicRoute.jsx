import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { Loader } from '../../components/UI/Loader/Loader';

const PublicRoute = React.memo(({ children }) => {
  const session = useAuthStore((state) => state.session);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <div className="fullscreen-loader">
        <Loader />
      </div>
    );
  }

  return !session ? children : <Navigate to="/home" replace />;
});

export default PublicRoute;
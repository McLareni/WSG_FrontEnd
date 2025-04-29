import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { AuthToastContainer } from '../../UI/ToastAuth/ToastAuth';

const MainContent = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    // Перевіряємо параметр URL
    if (new URLSearchParams(location.search).get('loginSuccess') === 'true') {
      toast.success(t('validation:login.success'));
    }
  }, [location]);

  return (
    <main>
      <h1>Welcome to Home Page</h1>
      <AuthToastContainer />
    </main>
  );
};

export default MainContent;
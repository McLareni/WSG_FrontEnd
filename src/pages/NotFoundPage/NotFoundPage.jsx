// src/pages/NotFoundPage/NotFoundPage.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  const { t } = useTranslation(['common']);
  
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.message')}</p>
      <Link to="/">{t('notFound.goHome')}</Link>
    </div>
  );
};

export default NotFoundPage;
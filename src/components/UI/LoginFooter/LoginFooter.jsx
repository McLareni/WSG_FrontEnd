// src/UI/Footer/Footer.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styles from './LoginFooter.module.css';

const Footer = ({ variant = 'login' }) => {
  const { t } = useTranslation('adminUser');
  
  const textKey = variant === 'login' 
    ? 'common.noAccount' 
    : 'common.alreadyHaveAccount';
  
  const linkKey = variant === 'login'
    ? 'buttons.registration'
    : 'buttons.login';
    
  const linkPath = variant === 'login' ? '/register' : '/login';

  return (
    <div className={styles.footer}>
      <span className={styles.text}>{t(textKey)}&nbsp;</span>
      <Link to={linkPath} className={styles.link}>
        {t(linkKey)}
      </Link>
    </div>
  );
};

export default Footer;
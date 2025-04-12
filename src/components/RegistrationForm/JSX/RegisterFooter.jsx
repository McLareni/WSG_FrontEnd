import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../CSS/RegisterFooter.module.css';

const RegisterFooter = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.footer}>
      <p>
        <span className={styles.text}>{t('alreadyHaveAccount')}</span>
        <a href="/login" className={styles.link}>{t('login')}</a>
      </p>
    </div>
  );
};

export default RegisterFooter;
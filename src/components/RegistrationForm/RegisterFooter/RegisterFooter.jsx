import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RegisterFooter.module.css';

const RegisterFooter = () => {
  const { t } = useTranslation('adminUser');
  return (
    <div className={styles.footer}>
      <p>
        <span className={styles.text}>{t('common.alreadyHaveAccount')}</span>
        <a href="/login" className={styles.link}>{t('buttons.login')}</a>
      </p>
    </div>
  );
};

export default RegisterFooter;
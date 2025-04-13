import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LoginFooter.module.css';

const LoginFooter = () => {
  const { t } = useTranslation('adminUser');
  return (
    <div className={styles.footer}>
      <span className={styles.text}>{t('common.noAccount')}&nbsp;</span>
      <a href="/register" className={styles.link}>
        {t('buttons.registration')}
      </a>
    </div>
  );
};

export default LoginFooter;
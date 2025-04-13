import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LoginButton.module.css';

const LoginButton = () => {
  const { t } = useTranslation('adminUser');
  return (
    <button type="submit" className={styles.button}>
      {t('buttons.login')}
    </button>
  );
};

export default LoginButton;
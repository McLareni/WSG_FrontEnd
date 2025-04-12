import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../CSS/RegisterButton.module.css';

const RegisterButton = () => {
  const { t } = useTranslation();
  return (
    <button type="submit" className={styles.button}>
      <span className={styles.text}>{t('registration')}</span>
    </button>
  );
};

export default RegisterButton;
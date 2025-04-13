import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RegisterButton.module.css';

const RegisterButton = () => {
  const { t } = useTranslation('adminUser');
  return (
    <button type="submit" className={styles.button}>
      <span className={styles.text}>{t('buttons.registration')}</span>
    </button>
  );
};

export default RegisterButton;
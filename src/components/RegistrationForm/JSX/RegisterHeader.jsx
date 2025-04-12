import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../CSS/RegisterHeader.module.css';

const RegisterHeader = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{t('welcome')}</h1>
    </div>
  );
};

export default RegisterHeader;
import React from 'react';
import styles from './RegisterHeader.module.css';

const RegisterHeader = ({ title, subtitle }) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
};

export default RegisterHeader;
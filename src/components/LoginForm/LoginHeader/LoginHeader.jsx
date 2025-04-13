import React from 'react';
import styles from './LoginHeader.module.css';

const LoginHeader = ({ title, subtitle }) => {
  return (
    <div className={styles.headerContainer}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
};

export default LoginHeader;
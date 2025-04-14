// src/UI/Header/Header.jsx
import React from 'react';
import styles from './LoginHeader.module.css';

const Header = ({ 
  title, 
  subtitle, 
  variant = 'login', 
  ...props 
}) => {
  return (
    <div className={`${styles.header} ${styles[variant]}`} {...props}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
};

export default Header;
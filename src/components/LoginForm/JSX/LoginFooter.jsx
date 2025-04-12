import React from 'react';
import styles from '../CSS/LoginFooter.module.css';

const LoginFooter = ({ text, linkText, link }) => {
  return (
    <div className={styles.footer}>
      <span className={styles.text}>{text}</span>
      <a href={link} className={styles.link}> {linkText}</a>
    </div>
  );
};

export default LoginFooter;
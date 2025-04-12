import React from 'react';
import styles from '../CSS/LoginButton.module.css';

const LoginButton = ({ text }) => {
  return (
    <button type="submit" className={styles.button}>
      {text}
      
    </button>
  );
};

export default LoginButton;
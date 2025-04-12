import React from 'react';
import styles from '../CSS/LoginInput.module.css';

const LoginInput = ({ label, type, name, value, onChange, error }) => {
  return (
    <div className={styles.inputContainer}>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`${styles.input} ${error ? styles.error : ''}`}
        required
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default LoginInput;
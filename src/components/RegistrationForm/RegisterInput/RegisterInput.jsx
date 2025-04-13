import React from 'react';
import styles from './RegisterInput.module.css';

const RegisterInput = ({ label, type, name, value, onChange, disabled, error }) => {
  return (
    <div className={styles.inputGroup}>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`${styles.input} ${error ? styles.error : ''}`}
        disabled={disabled}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default RegisterInput;
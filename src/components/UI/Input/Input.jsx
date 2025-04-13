// src/UI/Input/Input.jsx
import React from 'react';
import styles from './Input.module.css';

const Input = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  disabled = false, 
  error = null,
  width = '100%',
  ...props 
}) => {
  return (
    <div className={styles.container} style={{ width }}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${styles.input} ${error ? styles.error : ''}`}
        {...props}
      />
      <span className={styles.errorMessage}>
        {error || '\u00A0'}
      </span>
    </div>
  );
};

export default Input;
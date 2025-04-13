// src/UI/Checkbox/Checkbox.jsx
import React from 'react';
import styles from './Checkbox.module.css';

const Checkbox = ({ 
  id,
  name,
  checked,
  onChange,
  label,
  disabled = false
}) => {
  return (
    <div className={styles.container}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={styles.input}
      />
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
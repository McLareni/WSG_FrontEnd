import React from "react";
import styles from "./Input.module.css";

const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  disabled = false,
  error = null,
  hasSoftError = false,
  width = "100%",
  required = false,
  ...props
}) => {
  return (
    <div className={styles.container} style={{ width }}>
      <div className={styles.topRow}>
        {label && (
          <label className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`${styles.input} ${
          error ? styles.error : hasSoftError ? styles.softError : ""
        }`}
        {...props}
      />
    </div>
  );
};

export default Input;
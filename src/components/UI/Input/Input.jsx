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
  hasSoftError = false, // 🔥 Новий проп для м'якої помилки
  width = "100%",
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
        onBlur={onBlur}
        disabled={disabled}
        className={`${styles.input} ${error ? styles.error : ""} ${
          hasSoftError ? styles.softError : ""
        }`} 
        {...props}
      />
      <span className={styles.errorMessage}>
        {error || "\u00A0"}
      </span>
    </div>
  );
};

export default Input;

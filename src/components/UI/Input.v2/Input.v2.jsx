// src/components/UI/Input.v2/Input.v2.jsx
import React from "react";
import styles from "./Input.v2.module.css";

const InputV2 = ({
  value = "",
  onChange = () => {},
  placeholder = "",
  width = "690px",
  height = "55px",
}) => {
  return (
    <div className={styles.inputContainer} style={{ width, height }}>
      <input
        type="text"
        className={styles.inputField}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputV2;

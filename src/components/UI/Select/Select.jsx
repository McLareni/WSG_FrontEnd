import React from "react";
import styles from "./Select.module.css";

const Select = ({ value, onChange, options = [], className = "" }) => (
  <select
    className={`${styles.select} ${className}`}
    value={value}
    onChange={onChange}
  >
    {options.map((opt) =>
      typeof opt === "string" ? (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ) : (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      )
    )}
  </select>
);

export default Select;

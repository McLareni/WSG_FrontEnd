// src/components/UI/Dropdown/Dropdown.jsx
import React, { useState } from "react";
import { VscChevronDown } from "react-icons/vsc";
import styles from "./Dropdown.module.css";

const Dropdown = ({
  label,
  options,
  selected,
  onSelect,
  width = "242px",
  height = "55px",
  className = "",
  textStyle = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.dropdownContainer}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.dropdown}>
        <button
          className={`${styles.dropdownButton} ${className}`}
          style={{ width, height }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span style={textStyle}>{selected}</span>
          <span className={styles.arrow}>
            <VscChevronDown />
          </span>
        </button>

        {isOpen && (
          <div className={styles.dropdownMenu}>
            {options.map((option) => (
              <div
                key={option}
                className={styles.menuItem}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;

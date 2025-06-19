import { useState, useRef, useEffect } from "react";
import styles from "./SearchableDropdown.module.css";

export default function SearchableDropdown({
  options = [],
  option = "",
  onSelect,
  onChangeText,
  placeholder = "Select...",
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(option);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setInputValue(option);
  }, [option]);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = (value) => {
    onSelect(value);
    setIsOpen(false);
  };

  const handleChange = (e) => {
    if (disabled) return;
    const value = e.target.value;
    setInputValue(value);
    onChangeText(value);
    setIsOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={dropdownRef}>
      <input
        type="text"
        value={inputValue || ""}
        onChange={handleChange}
        onFocus={() => {
          if (!disabled) setIsOpen(true);
        }}
        placeholder={placeholder}
        className={styles.input}
        disabled={disabled}
      />
      {isOpen && (
        <ul className={styles.dropdown}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, index) => (
              <li
                key={index}
                onClick={() => handleSelect(opt)}
                className={styles.option}
              >
                {opt}
              </li>
            ))
          ) : (
            <li className={styles.noResults}>No results</li>
          )}
        </ul>
      )}
    </div>
  );
}

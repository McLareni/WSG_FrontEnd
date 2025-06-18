import { useState, useRef, useEffect } from "react";
import styles from "./SearchableDropdown.module.css";

export default function SearchableDropdown({
  options = [],
  onSelect,
  onChangeText,
  placeholder = "Select...",
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (value) => {
    onSelect(value);
    setQuery(value);
    setIsOpen(false);
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
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChangeText(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className={styles.input}
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

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'pl', label: 'PL' },
    { code: 'uk', label: 'UA' }
  ];

  const currentLangObj = languages.find(lang => lang.code === currentLanguage);
  const otherLanguages = languages.filter(lang => lang.code !== currentLanguage);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.languageSwitcher} ref={wrapperRef}>
      <div className={styles.dropdownWrapper}>
        <div className={`${styles.dropdownContainer} ${isOpen ? styles.open : ''}`}>
          <button
            className={styles.languageButton}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{currentLangObj?.label}</span>
            <img
              src="/arrow.svg"
              alt="arrow"
              className={`${styles.arrowIcon} ${isOpen ? styles.arrowUp : styles.arrowDown}`}
            />
          </button>

          <div className={`${styles.dropdownMenu} ${isOpen ? styles.menuOpen : styles.menuClosed}`}>
            {otherLanguages.map(lang => (
              <button
                key={lang.code}
                onClick={() => {
                  i18n.changeLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={styles.menuItem}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
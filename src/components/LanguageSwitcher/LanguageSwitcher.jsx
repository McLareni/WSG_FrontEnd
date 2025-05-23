import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import styles from './styles.module.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  
  //Дефолт мова
  const currentLanguage = i18n.language || localStorage.getItem('i18nextLng') || 'pl';
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'pl', label: 'PL' },
    { code: 'uk', label: 'UA' }
  ];

  const defaultLanguage = languages.some(lang => lang.code === currentLanguage) 
    ? currentLanguage 
    : languages[0].code;

  const currentLangObj = languages.find(lang => lang.code === defaultLanguage);
  const otherLanguages = languages.filter(lang => lang.code !== defaultLanguage);

  useEffect(() => {
    if (i18n.language !== defaultLanguage) {
      i18n.changeLanguage(defaultLanguage);
    }
  }, [defaultLanguage, i18n]);

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
            aria-label="Change language"
          >
            <span>{currentLangObj?.label}</span>
            {isOpen ? (
              <FaArrowUp className={styles.arrowIcon} />
            ) : (
              <FaArrowDown className={styles.arrowIcon} />
            )}
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
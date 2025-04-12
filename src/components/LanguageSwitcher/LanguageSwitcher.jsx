import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={styles.languageSwitcher}>
      <button
        onClick={() => changeLanguage('en')}
        className={currentLanguage === 'en' ? styles['active-en'] : ''}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('pl')}
        className={currentLanguage === 'pl' ? styles['active-pl'] : ''}
      >
        PL
      </button>
      <button
        onClick={() => changeLanguage('uk')}
        className={currentLanguage === 'uk' ? styles['active-ua'] : ''}
      >
        UA
      </button>
    </div>
  );
};

export default LanguageSwitcher;

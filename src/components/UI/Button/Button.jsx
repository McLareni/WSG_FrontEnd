// src/UI/Button/Button.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Button.module.css';

const Button = ({ 
  type = 'submit',
  variant = 'login', 
  showTextSpan = false,
  ...props 
}) => {
  const { t } = useTranslation('adminUser');
  
  const buttonText = variant === 'login' 
    ? t('buttons.login') 
    : t('buttons.registration');

  return (
    <button 
      type={type}
      className={`${styles.button} ${styles[variant]}`}
      {...props}
    >
      {showTextSpan ? (
        <span className={styles.text}>{buttonText}</span>
      ) : (
        buttonText
      )}
    </button>
  );
};

export default Button;
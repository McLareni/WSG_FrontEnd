import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Button.module.css';

const Button = ({ 
  type = 'submit',
  variant = 'login', 
  showTextSpan = false,
  loading = false,  // Додано новий проп
  children,
  ...props 
}) => {
  const { t } = useTranslation('adminUser');
  
  const buttonText = variant === 'login' 
    ? t('buttons.login') 
    : variant === 'register'
    ? t('buttons.registration')
    : children;

  return (
    <button 
      type={type}
      className={`${styles.button} ${styles[variant]} ${
        loading ? styles.loading : ''
      }`}
      aria-busy={loading}
      disabled={loading || props.disabled}
      {...props}
    >
      {showTextSpan ? (
        <span className={styles.text}>
          {loading ? t('buttons.loading') : buttonText}
        </span>
      ) : (
        loading ? t('buttons.loading') : buttonText
      )}
    </button>
  );
};

export default Button;
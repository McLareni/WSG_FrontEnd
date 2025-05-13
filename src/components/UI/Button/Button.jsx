import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Button.module.css';

// Button.jsx
const Button = ({ 
  type = 'submit',
  variant = 'default', 
  showTextSpan = false,
  loading = false,
  children,
  ...props 
}) => {
  const { t } = useTranslation(['tabProfile', 'adminUser']);
  
  const getButtonText = () => {
    const adminUserButtons = {
      login: 'buttons.login',
      registration: 'buttons.registration', // Додано registration
      loading: 'buttons.loading',
      register: 'buttons.registration' // Альтернативний ключ
    };

    const tabProfileButtons = {
      edit: 'edit',
      changePassword: 'changePassword',
      cancel: 'buttons.cancel',
      saveChanges: 'buttons.saveChanges'
    };

    if (adminUserButtons[variant]) {
      return t(adminUserButtons[variant], { ns: 'adminUser' });
    }
    if (tabProfileButtons[variant]) {
      return t(tabProfileButtons[variant], { ns: 'tabProfile' });
    }
    return children || '';
  };

  return (
    <button 
      type={type}
      className={`${styles.button} ${styles[variant]}`}
      aria-busy={loading}
      disabled={loading || props.disabled}
      {...props}
    >
      {showTextSpan ? (
        <span className={styles.text}>
          {loading ? t('buttons.loading', { ns: 'adminUser' }) : getButtonText()}
        </span>
      ) : (
        loading ? t('buttons.loading', { ns: 'adminUser' }) : getButtonText()
      )}
    </button>
  );
};

export default Button;
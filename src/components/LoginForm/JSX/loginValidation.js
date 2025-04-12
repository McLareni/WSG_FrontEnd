// utils/loginValidation.js
import i18n from '../../../../node_modules/i18next-browser-languagedetector';

// Валідація всієї форми логіну
export const validateLoginForm = (formData) => {
  const errors = {};
  const { email, password } = formData;
  
  if (!email?.trim()) {
    errors.email = i18n.t('emailRequired');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = i18n.t('invalidEmail');
  }

  if (!password) {
    errors.password = i18n.t('passwordRequired');
  } else if (password.length < 6) {
    errors.password = i18n.t('passwordTooShort');
  }

  return errors;
};

// Валідація окремого поля форми
export const validateLoginField = (name, value) => {
  const fieldErrors = {};
  
  switch (name) {
    case 'email':
      if (!value?.trim()) {
        fieldErrors.email = i18n.t('emailRequired');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        fieldErrors.email = i18n.t('invalidEmail');
      }
      break;
      
    case 'password':
      if (!value) {
        fieldErrors.password = i18n.t('passwordRequired');
      } else if (value.length < 6) {
        fieldErrors.password = i18n.t('passwordTooShort');
      }
      break;
  }

  return fieldErrors;
};

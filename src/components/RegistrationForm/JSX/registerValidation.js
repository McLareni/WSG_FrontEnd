// utils/registerValidation.js
import i18n from '../../../../node_modules/i18next-browser-languagedetector';

export const validateRegisterForm = (formData) => {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const nameRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻа-яА-ЯЇїІіЄєҐґ]+$/u;

  // Валідація імені
  if (!formData.firstName.trim()) {
    errors.firstName = i18n.t('firstNameTooShort');
  } else if (formData.firstName.length < 2) {
    errors.firstName = i18n.t('firstNameTooShort');
  } else if (!nameRegex.test(formData.firstName)) {
    errors.firstName = i18n.t('firstNameInvalidChars');
  }

  // Валідація прізвища
  if (!formData.lastName.trim()) {
    errors.lastName = i18n.t('lastNameTooShort');
  } else if (formData.lastName.length < 2) {
    errors.lastName = i18n.t('lastNameTooShort');
  } else if (!nameRegex.test(formData.lastName)) {
    errors.lastName = i18n.t('lastNameInvalidChars');
  }

  // Валідація номера альбому
  if (!formData.isTeacher) {
    if (!formData.studentId.trim()) {
      errors.studentId = i18n.t('albumNumberTooShort');
    } else if (formData.studentId.length < 5) {
      errors.studentId = i18n.t('albumNumberTooShort');
    } else if (!/^\d+$/.test(formData.studentId)) {
      errors.studentId = i18n.t('albumNumberOnlyDigits');
    }
  }

  // Валідація email
  if (!formData.email.trim()) {
    errors.email = i18n.t('emailRequired');
  } else if (!emailRegex.test(formData.email)) {
    errors.email = i18n.t('invalidEmail');
  }

  // Валідація пароля
  if (!formData.password) {
    errors.password = i18n.t('passwordRequired');
  } else if (!passwordRegex.test(formData.password)) {
    errors.password = i18n.t('passwordTooShort');
  }

  // Валідація підтвердження пароля
  if (!formData.confirmPassword) {
    errors.confirmPassword = i18n.t('passwordRequired');
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = i18n.t('passwordsNotMatch');
  }

  return errors;
};

export const validateField = (name, value, formData) => {
  const fieldErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const nameRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻа-яА-ЯЇїІіЄєҐґ]+$/u;

  switch (name) {
    case 'firstName':
      if (!value.trim()) fieldErrors.firstName = i18n.t('firstNameTooShort');
      else if (value.length < 2) fieldErrors.firstName = i18n.t('firstNameTooShort');
      else if (!nameRegex.test(value)) fieldErrors.firstName = i18n.t('firstNameInvalidChars');
      break;
    case 'lastName':
      if (!value.trim()) fieldErrors.lastName = i18n.t('lastNameTooShort');
      else if (value.length < 2) fieldErrors.lastName = i18n.t('lastNameTooShort');
      else if (!nameRegex.test(value)) fieldErrors.lastName = i18n.t('lastNameInvalidChars');
      break;
    case 'studentId':
      if (!formData.isTeacher) {
        if (!value.trim()) fieldErrors.studentId = i18n.t('albumNumberTooShort');
        else if (value.length < 5) fieldErrors.studentId = i18n.t('albumNumberTooShort');
        else if (!/^\d+$/.test(value)) fieldErrors.studentId = i18n.t('albumNumberOnlyDigits');
      }
      break;
    case 'email':
      if (!value.trim()) fieldErrors.email = i18n.t('emailRequired');
      else if (!emailRegex.test(value)) fieldErrors.email = i18n.t('invalidEmail');
      break;
    case 'password':
      if (!value) fieldErrors.password = i18n.t('passwordRequired');
      else if (!passwordRegex.test(value)) fieldErrors.password = i18n.t('passwordTooShort');
      break;
    case 'confirmPassword':
      if (!value) fieldErrors.confirmPassword = i18n.t('passwordRequired');
      else if (formData.password !== value) fieldErrors.confirmPassword = i18n.t('passwordsNotMatch');
      break;
    default:
      break;
  }

  return fieldErrors;
};
// utils/registerValidation.js
export const validateRegisterForm = (formData, t) => {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,@!#%?\/_\-])[A-Za-z\d.,@!#%?\/_\-]{8,}$/;
  const nameRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻа-яА-ЯЇїІіЄєҐґ]+$/u;

  // Валідація імені
  if (!formData.firstName.trim()) {
    errors.firstName = t('validation:firstNameRequired');
  } else if (formData.firstName.length < 2 || formData.firstName.length > 50) {
    errors.firstName = t('validation:firstNameTooShort');
  } else if (!nameRegex.test(formData.firstName)) {
    errors.firstName = t('validation:firstNameInvalidChars');
  }

  // Валідація прізвища
  if (!formData.lastName.trim()) {
    errors.lastName = t('validation:lastNameRequired');
  } else if (formData.lastName.length < 2 || formData.lastName.length > 50) {
    errors.lastName = t('validation:lastNameTooShort');
  } else if (!nameRegex.test(formData.lastName)) {
    errors.lastName = t('validation:lastNameInvalidChars');
  }

  // Валідація номера альбому
  if (!formData.isTeacher) {
    if (!formData.studentId.trim()) {
      errors.studentId = t('validation:albumNumberRequired');
    } else if (formData.studentId.length !== 6) {
      errors.studentId = t('validation:albumNumberTooShort');
    } else if (!/^\d+$/.test(formData.studentId)) {
      errors.studentId = t('validation:albumNumberOnlyDigits');
    }
  }

  // Валідація email
  if (!formData.email.trim()) {
    errors.email = t('validation:emailRequired');
  } else if (!emailRegex.test(formData.email)) {
    errors.email = t('validation:invalidEmail');
  }

  // Валідація пароля
  if (!formData.password) {
    errors.password = t('validation:passwordRequired');
  } else if (!passwordRegex.test(formData.password)) {
    errors.password = formData.password.length < 8
      ? t('validation:passwordTooShort')
      : t('validation:passwordInvalidFormat');
  }

  // Валідація підтвердження пароля
  if (!formData.confirmPassword) {
    errors.confirmPassword = t('validation:passwordRequired');
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = t('validation:passwordsNotMatch');
  }

  return errors;
};

export const validateField = (name, value, formData, t) => {
  const fieldErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,@!#%?\/_\-])[A-Za-z\d.,@!#%?\/_\-]{8,}$/;
  const nameRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻа-яА-ЯЇїІіЄєҐґ]+$/u;

  switch (name) {
    case 'firstName':
      if (!value.trim()) fieldErrors.firstName = t('validation:firstNameRequired');
      else if (value.length < 2 || value.length > 50) fieldErrors.firstName = t('validation:firstNameTooShort');
      else if (!nameRegex.test(value)) fieldErrors.firstName = t('validation:firstNameInvalidChars');
      break;
    case 'lastName':
      if (!value.trim()) fieldErrors.lastName = t('validation:lastNameRequired');
      else if (value.length < 2 || value.length > 50) fieldErrors.lastName = t('validation:lastNameTooShort');
      else if (!nameRegex.test(value)) fieldErrors.lastName = t('validation:lastNameInvalidChars');
      break;
    case 'studentId':
      if (!formData.isTeacher) {
        if (!value.trim()) fieldErrors.studentId = t('validation:albumNumberRequired');
        else if (value.length !== 6) fieldErrors.studentId = t('validation:albumNumberTooShort');
        else if (!/^\d+$/.test(value)) fieldErrors.studentId = t('validation:albumNumberOnlyDigits');
      }
      break;
    case 'email':
      if (!value.trim()) fieldErrors.email = t('validation:emailRequired');
      else if (!emailRegex.test(value)) fieldErrors.email = t('validation:invalidEmail');
      break;
    case 'password':
      if (!value) fieldErrors.password = t('validation:passwordRequired');
      else if (!passwordRegex.test(value)) {
        fieldErrors.password = value.length < 8
          ? t('validation:passwordTooShort')
          : t('validation:passwordInvalidFormat');
      }
      break;
    case 'confirmPassword':
      if (!value) fieldErrors.confirmPassword = t('validation:passwordRequired');
      else if (formData.password !== value) fieldErrors.confirmPassword = t('validation:passwordsNotMatch');
      break;
    default:
      break;
  }

  return fieldErrors;
};
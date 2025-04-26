export const validateRegisterForm = (formData, t) => {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const latinNameRegex = /^[a-zA-Z]+$/;
  const latinNameWithHyphenRegex = /^[a-zA-Z-]+$/; // Allows hyphens for compound names

  // First name validation
  if (!formData.firstName.trim()) {
    errors.firstName = t('validation:firstName.required');
  } else if (formData.firstName.length < 2 || formData.firstName.length > 50) {
    errors.firstName = t('validation:firstName.tooShort');
  } else if (!latinNameWithHyphenRegex.test(formData.firstName)) {
    errors.firstName = t('validation:firstName.invalidChars');
  }

  // Last name validation
  if (!formData.lastName.trim()) {
    errors.lastName = t('validation:lastName.required');
  } else if (formData.lastName.length < 2 || formData.lastName.length > 50) {
    errors.lastName = t('validation:lastName.tooShort');
  } else if (!latinNameWithHyphenRegex.test(formData.lastName)) {
    errors.lastName = t('validation:lastName.invalidChars');
  }

  // Album number validation
  if (!formData.isTeacher) {
    if (!formData.studentId.trim()) {
      errors.studentId = t('validation:albumNumber.required');
    } else if (formData.studentId.length !== 6) {
      errors.studentId = t('validation:albumNumber.tooShort');
    } else if (!/^\d+$/.test(formData.studentId)) {
      errors.studentId = t('validation:albumNumber.onlyDigits');
    }
  }

  // Email validation
  if (!formData.email.trim()) {
    errors.email = t('validation:email.required');
  } else if (!emailRegex.test(formData.email)) {
    errors.email = t('validation:email.invalid');
  }

  // Password validation
  const passwordError = validatePassword(formData.password, t);
  if (passwordError) {
    errors.password = passwordError;
  }

  // Confirm password validation
  if (!formData.confirmPassword) {
    errors.confirmPassword = t('validation:password.required');
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = t('validation:password.notMatch');
  }

  return errors;
};

export const validateField = (name, value, formData, t) => {
  const fieldErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const latinNameRegex = /^[a-zA-Z-]+$/; // Allows hyphens

  switch (name) {
    case 'firstName':
      if (!value.trim()) {
        fieldErrors.firstName = t('validation:firstName.required');
      } else if (value.length < 2 || value.length > 50) {
        fieldErrors.firstName = t('validation:firstName.tooShort');
      } else if (!latinNameRegex.test(value)) {
        fieldErrors.firstName = t('validation:firstName.invalidChars');
      } else {
        fieldErrors.firstName = '';
      }
      break;
      
    case 'lastName':
      if (!value.trim()) {
        fieldErrors.lastName = t('validation:lastName.required');
      } else if (value.length < 2 || value.length > 50) {
        fieldErrors.lastName = t('validation:lastName.tooShort');
      } else if (!latinNameRegex.test(value)) {
        fieldErrors.lastName = t('validation:lastName.invalidChars');
      } else {
        fieldErrors.lastName = '';
      }
      break;
      
    case 'studentId':
      if (!formData.isTeacher) {
        if (!value.trim()) {
          fieldErrors.studentId = t('validation:albumNumber.required');
        } else if (value.length !== 6) {
          fieldErrors.studentId = t('validation:albumNumber.tooShort');
        } else if (!/^\d+$/.test(value)) {
          fieldErrors.studentId = t('validation:albumNumber.onlyDigits');
        } else {
          fieldErrors.studentId = '';
        }
      } else {
        fieldErrors.studentId = '';
      }
      break;
      
    case 'email':
      if (!value.trim()) {
        fieldErrors.email = t('validation:email.required');
      } else if (!emailRegex.test(value)) {
        fieldErrors.email = t('validation:email.invalid');
      } else {
        fieldErrors.email = '';
      }
      break;
      
    case 'password':
      fieldErrors.password = validatePassword(value, t) || '';
      break;
      
    case 'confirmPassword':
      if (!value) {
        fieldErrors.confirmPassword = t('validation:password.required');
      } else if (formData.password !== value) {
        fieldErrors.confirmPassword = t('validation:password.notMatch');
      } else {
        fieldErrors.confirmPassword = '';
      }
      break;
      
    case 'isTeacher':
      // No validation needed for checkbox
      break;
      
    default:
      break;
  }

  return fieldErrors;
};

const validatePassword = (password, t) => {
  if (!password) {
    return t('validation:password.required');
  }
  
  if (password.length < 8) {
    return t('validation:password.tooShort');
  }

  // Check for at least one uppercase letter (A-Z or Cyrillic)
  if (!/(?=.*[A-ZА-ЯЁ])/.test(password)) {
    return t('validation:password.requireUppercase');
  }

  // Check for at least one lowercase letter (a-z or Cyrillic)
  if (!/(?=.*[a-zа-яё])/.test(password)) {
    return t('validation:password.requireLowercase');
  }

  // Check for at least one digit (0-9)
  if (!/\d/.test(password)) {
    return t('validation:password.requireDigit');
  }

  // Check for at least one special character (non-letter, non-digit)
  if (!/[^A-Za-zА-Яа-яЁё0-9]/.test(password)) {
    return t('validation:password.requireSpecialChar');
  }

  return '';
};
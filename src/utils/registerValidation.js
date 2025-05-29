export const validateRegisterForm = (formData, t) => {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // First name validation (only Latin letters)
  if (!formData.firstName.trim()) {
    errors.firstName = t('validation:firstName.required');
  } else if (formData.firstName.length < 2 || formData.firstName.length > 50) {
    errors.firstName = t('validation:firstName.tooShort');
  } else if (!/^[a-zA-Z'-]+$/.test(formData.firstName)) {
    errors.firstName = t('validation:firstName.invalidChars');
  }

  // Last name validation (only Latin letters)
  if (!formData.lastName.trim()) {
    errors.lastName = t('validation:lastName.required');
  } else if (formData.lastName.length < 2 || formData.lastName.length > 50) {
    errors.lastName = t('validation:lastName.tooShort');
  } else if (!/^[a-zA-Z'-]+$/.test(formData.lastName)) {
    errors.lastName = t('validation:lastName.invalidChars');
  }

  // Album number validation (only when not teacher)
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

  // Remove empty errors
  Object.keys(errors).forEach(key => {
    if (!errors[key]) delete errors[key];
  });

  return errors;
};

export const validateField = (name, value, formData, t) => {
  const fieldErrors = {};
  
  switch (name) {
    case 'firstName':
      if (!value.trim()) {
        fieldErrors.firstName = t('validation:firstName.required');
      } else if (value.length < 2 || value.length > 50) {
        fieldErrors.firstName = t('validation:firstName.tooShort');
      } else if (!/^[a-zA-Z'-]+$/.test(value)) {
        fieldErrors.firstName = t('validation:firstName.invalidChars');
      }
      break;
      
    case 'lastName':
      if (!value.trim()) {
        fieldErrors.lastName = t('validation:lastName.required');
      } else if (value.length < 2 || value.length > 50) {
        fieldErrors.lastName = t('validation:lastName.tooShort');
      } else if (!/^[a-zA-Z'-]+$/.test(value)) {
        fieldErrors.lastName = t('validation:lastName.invalidChars');
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
        }
      }
      break;
      
    case 'email':
      if (!value.trim()) {
        fieldErrors.email = t('validation:email.required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        fieldErrors.email = t('validation:email.invalid');
      }
      break;
      
    case 'password':
      fieldErrors.password = validatePassword(value, t);
      break;
      
    case 'confirmPassword':
      if (!value) {
        fieldErrors.confirmPassword = t('validation:password.required');
      } else if (formData.password !== value) {
        fieldErrors.confirmPassword = t('validation:password.notMatch');
      }
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

  if (!/[A-Z]/.test(password)) {
    return t('validation:password.requireUppercase');
  }

  if (!/[a-z]/.test(password)) {
    return t('validation:password.requireLowercase');
  }

  if (!/\d/.test(password)) {
    return t('validation:password.requireDigit');
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return t('validation:password.requireSpecialChar');
  }

  return '';
};
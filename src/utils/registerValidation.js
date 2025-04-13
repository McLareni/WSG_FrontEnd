export const validateRegisterForm = (formData, t) => {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameRegex = /^[\p{L}]+$/u; // Універсальний regex для літер будь-якої мови

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
  const passwordError = validatePassword(formData.password, t);
  if (passwordError) {
    errors.password = passwordError;
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
  const nameRegex = /^[\p{L}]+$/u; // Універсальний regex для літер будь-якої мови

  switch (name) {
    case 'firstName':
      if (!value.trim()) {
        fieldErrors.firstName = t('validation:firstNameRequired');
      } else if (value.length < 2 || value.length > 50) {
        fieldErrors.firstName = t('validation:firstNameTooShort');
      } else if (!nameRegex.test(value)) {
        fieldErrors.firstName = t('validation:firstNameInvalidChars');
      } else {
        fieldErrors.firstName = '';
      }
      break;
      
    case 'lastName':
      if (!value.trim()) {
        fieldErrors.lastName = t('validation:lastNameRequired');
      } else if (value.length < 2 || value.length > 50) {
        fieldErrors.lastName = t('validation:lastNameTooShort');
      } else if (!nameRegex.test(value)) {
        fieldErrors.lastName = t('validation:lastNameInvalidChars');
      } else {
        fieldErrors.lastName = '';
      }
      break;
      
      case 'studentId':
        if (!formData.isTeacher) {
          if (!value.trim()) {
            fieldErrors.studentId = t('validation:albumNumberRequired');
          } else if (value.length !== 6) {
            fieldErrors.studentId = t('validation:albumNumberTooShort');
          } else if (!/^\d+$/.test(value)) {
            fieldErrors.studentId = t('validation:albumNumberOnlyDigits');
          } else {
            fieldErrors.studentId = '';
          }
        } else {
         
          fieldErrors.studentId = '';
        }
        break;
      
    case 'email':
      if (!value.trim()) {
        fieldErrors.email = t('validation:emailRequired');
      } else if (!emailRegex.test(value)) {
        fieldErrors.email = t('validation:invalidEmail');
      } else {
        fieldErrors.email = '';
      }
      break;
      
    case 'password':
      fieldErrors.password = validatePassword(value, t) || '';
      break;
      
    case 'confirmPassword':
      if (!value) {
        fieldErrors.confirmPassword = t('validation:passwordRequired');
      } else if (formData.password !== value) {
        fieldErrors.confirmPassword = t('validation:passwordsNotMatch');
      } else {
        fieldErrors.confirmPassword = '';
      }
      break;
      
    case 'isTeacher':
      // Валідація не потрібна для чекбоксу
      break;
      
    default:
      break;
  }

  return fieldErrors;
};

const validatePassword = (password, t) => {
  if (!password) {
    return t('validation:passwordRequired');
  }
  
  if (password.length < 8) {
    return t('validation:passwordTooShort');
  }

  // Універсальна перевірка на наявність великої літери (будь-якої мови)
  if (!/(?=.*\p{Lu})/u.test(password)) {
    return t('validation:passwordRequireUppercase');
  }

  // Універсальна перевірка на наявність малої літери (будь-якої мови)
  if (!/(?=.*\p{Ll})/u.test(password)) {
    return t('validation:passwordRequireLowercase');
  }

  // Перевірка на цифри
  if (!/\d/.test(password)) {
    return t('validation:passwordRequireDigit');
  }

  // Перевірка на спецсимволи
  if (!/[^\p{L}\d]/u.test(password)) {
    return t('validation:passwordRequireSpecialChar');
  }

  return '';
};
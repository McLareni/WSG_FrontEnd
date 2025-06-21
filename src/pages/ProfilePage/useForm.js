// useForm.js
import { toast } from 'react-toastify';
import { useCallback } from 'react';

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NAME_REGEX: /^[A-Za-z]+$/,
  ALBUM_NUMBER_REGEX: /^\d{6}$/,
  PASSWORD_UPPERCASE_REGEX: /[A-Z]/,
  PASSWORD_LOWERCASE_REGEX: /[a-z]/,
  PASSWORD_DIGIT_REGEX: /\d/,
  PASSWORD_SPECIAL_CHAR_REGEX: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
  UKRAINIAN_CHAR_REGEX: /[А-Яа-яЁёІіЇїЄєҐґ]/,
};

// Основні функції валідації
export const validateProfileData = (data, t) => {
  const errors = {};

  if (!data.first_name?.trim()) {
    errors.firstName = t("validation:firstName.required");
  } else if (data.first_name.trim().length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    errors.firstName = t("validation:firstName.tooShort");
  } else if (VALIDATION_RULES.UKRAINIAN_CHAR_REGEX.test(data.first_name.trim())) {
    errors.firstName = t("tabProfile:onlyLatin");
  } else if (!VALIDATION_RULES.NAME_REGEX.test(data.first_name.trim())) {
    errors.firstName = t("tabProfile:onlyLatin");
  }

  if (!data.last_name?.trim()) {
    errors.lastName = t("validation:lastName.required");
  } else if (data.last_name.trim().length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    errors.lastName = t("validation:lastName.tooShort");
  } else if (VALIDATION_RULES.UKRAINIAN_CHAR_REGEX.test(data.last_name.trim())) {
    errors.lastName = t("tabProfile:onlyLatin");
  } else if (!VALIDATION_RULES.NAME_REGEX.test(data.last_name.trim())) {
    errors.lastName = t("validation:lastName.invalidChars");
  }

  if (!data.email?.trim()) {
    errors.email = t("validation:email.required");
  } else if (!VALIDATION_RULES.EMAIL_REGEX.test(data.email.trim())) {
    errors.email = t("validation:email.invalid");
  }

  if (data.album_number && !VALIDATION_RULES.ALBUM_NUMBER_REGEX.test(data.album_number.trim())) {
    errors.albumNumber = t("validation:albumNumber.invalid");
  } else if (data.isStudent && !data.album_number?.trim()) {
    errors.albumNumber = t("validation:albumNumber.required");
  }

  return errors;
};

export const validatePasswordChange = (currentPassword, newPassword, confirmPassword, t) => {
  const errors = {};

  // Перевірка поточного пароля
  if (!currentPassword?.trim()) {
    errors.currentPassword = t("validationNewPassword:password.change.currentRequired");
  }

  // Перевірка нового пароля
  if (!newPassword?.trim()) {
    errors.newPassword = t("validationNewPassword:password.required");
  } else {
    if (newPassword.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
      errors.newPassword = t("validationNewPassword:password.requirements.length");
    } else if (newPassword === currentPassword) {
      errors.newPassword = t("validationNewPassword:password.change.sameAsOld");
    } else {
      // Check for uppercase letter
      if (!VALIDATION_RULES.PASSWORD_UPPERCASE_REGEX.test(newPassword)) {
        errors.newPassword = t("validationNewPassword:password.requirements.uppercase");
      }
      // Check for lowercase letter
      else if (!VALIDATION_RULES.PASSWORD_LOWERCASE_REGEX.test(newPassword)) {
        errors.newPassword = t("validationNewPassword:password.requirements.lowercase");
      }
      // Check for digit
      else if (!VALIDATION_RULES.PASSWORD_DIGIT_REGEX.test(newPassword)) {
        errors.newPassword = t("validationNewPassword:password.requirements.digit");
      }
      // Check for special character
      else if (!VALIDATION_RULES.PASSWORD_SPECIAL_CHAR_REGEX.test(newPassword)) {
        errors.newPassword = t("validationNewPassword:password.requirements.special");
      }
    }
  }

  // Перевірка підтвердження пароля
  if (!confirmPassword?.trim()) {
    errors.confirmPassword = t("validationNewPassword:password.confirmPassword.notMatch");
  } else if (newPassword !== confirmPassword) {
    errors.confirmPassword = t("validationNewPassword:password.confirmPassword.notMatch");
  }

  return errors;
};

// Хуки для форм (remain the same)
export const usePasswordValidation = (formData, t) => {
  return useCallback(() => validatePasswordChange(
    formData.currentPassword,
    formData.newPassword,
    formData.confirmPassword,
    t
  ), [formData, t]);
};

export const usePasswordSubmit = ({ formData, validateForm, changePassword, t, setErrors, navigate }) => {
  return useCallback(async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      throw new Error('Validation failed');
    }

    try {
      const result = await changePassword(
        formData.currentPassword,
        formData.newPassword
      );

      if (result?.success) {
        navigate('/profile');
        return true;
      }

      throw new Error(result?.error || 'Unknown error');
    } catch (error) {
      if (error.message.includes('invalidCurrent') || error.message.includes('sameAsOld')) {
        setErrors({
          currentPassword: error.message.includes('invalidCurrent') ? 
            t("validationNewPassword:password.change.invalidCurrent") : undefined,
          newPassword: error.message.includes('sameAsOld') ? 
            t("validationNewPassword:password.change.sameAsOld") : undefined,
        });
      } else {
        toast.error(getErrorMessage(t, error.message));
      }
      return false;
    }
  }, [formData, validateForm, changePassword, t, setErrors, navigate]);
};

// Допоміжні функції (remain the same)
export const getSuccessMessage = (t, type = 'profile') => {
  return type === 'password'
    ? t("validationNewPassword:password.change.success")
    : t("validationNewPassword:password.change.updatesuccess");
};

export const getErrorMessage = (t, errorKey) => {
  const errorMap = {
    'invalidCurrent': "validationNewPassword:password.change.invalidCurrent",
    'sameAsOld': "validationNewPassword:password.change.sameAsOld",
    'network': "errors.networkError",
    'server': "errors.serverError",
    'unauthorized': "errors.unauthorized",
    'default': "errors.unknownError"
  };

  const messageKey = errorMap[errorKey] || errorMap['default'];
  return t(messageKey);
};
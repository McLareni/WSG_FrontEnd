import { useCallback } from 'react';
import { toast } from 'react-toastify'; // Не забудьте імпортувати toast, якщо він використовується в usePasswordSubmit

export const usePasswordValidation = (formData, t) => {
  return useCallback(() => {
    const newErrors = {};
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword.trim()) {
      newErrors.currentPassword = t('validationNewPassword:password.change.currentRequired');
    }

    if (!newPassword) {
      newErrors.newPassword = t('validationNewPassword:password.required');
    } else {
      if (newPassword.length < 8) {
        newErrors.newPassword = t('validationNewPassword:password.requirements.length');
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t('validationNewPassword:password.confirmPassword.notMatch');
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = t('validationNewPassword:password.confirmPassword.notMatch');
    }

    return newErrors;
  }, [formData, t]);
};

export const usePasswordSubmit = ({
  formData,
  validateForm,
  changePassword,
  t,
  setErrors,
  navigate
}) => {
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
      if (error.message.includes('validationNewPassword:') || error.message.includes('errors.')) {
        setErrors({
          currentPassword: error.message.includes('invalidCurrent') ?
            t('validationNewPassword:password.change.invalidCurrent') : undefined,
          newPassword: error.message.includes('sameAsOld') ?
            t('validationNewPassword:password.change.sameAsOld') : undefined,
        });
        if (!error.message.includes('invalidCurrent') && !error.message.includes('sameAsOld')) {
            toast.error(t(error.message));
        }
      } else {
            toast.error(t("errors.serverError"));
      }
      return false;
    }
  }, [formData, validateForm, changePassword, t, setErrors, navigate]);
};

// store/validators.js

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NAME_REGEX: /^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+$/,
  ALBUM_NUMBER_REGEX: /^\d{6}$/,
};

export const validateProfileData = (data, t) => {
  const errors = {};

  if (!data.first_name?.trim()) {
    errors.firstName = t("validation:firstName.required"); // Залишається "validation:", бо це не стосується пароля
  } else if (data.first_name.trim().length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    errors.firstName = t("validation:firstName.tooShort");
  } else if (!VALIDATION_RULES.NAME_REGEX.test(data.first_name.trim())) {
    errors.firstName = t("validation:firstName.invalidChars");
  }

  if (!data.last_name?.trim()) {
    errors.lastName = t("validation:lastName.required");
  } else if (data.last_name.trim().length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    errors.lastName = t("validation:lastName.tooShort");
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

export const validatePassword = (password, confirmPassword, t) => {
  const errors = {};

  if (!password) {
    errors.password = t("validationNewPassword:password.required"); // Змінено
  } else if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    errors.password = t("validationNewPassword:password.requirements.length"); // Змінено
  }

  if (!confirmPassword) {
    errors.confirmPassword = t("validationNewPassword:password.confirmPassword.notMatch"); // Змінено
  } else if (password !== confirmPassword) {
    errors.confirmPassword = t("validationNewPassword:password.confirmPassword.notMatch"); // Змінено
  }

  return errors;
};

export const getSuccessMessage = (t, type = 'profile') => {
  return type === 'password'
    ? t("validationNewPassword:password.change.success") // Змінено
    : t("validationNewPassword:password.change.updatesuccess"); // Змінено
};

export const getErrorMessage = (t, errorKey) => {
  const errorMap = {
    'invalidCurrent': "validationNewPassword:password.change.invalidCurrent", // Змінено
    'sameAsOld': "validationNewPassword:password.change.sameAsOld", // Змінено
    'network': "errors.networkError", // Це припускає, що "errors.networkError" є у файлі errors.json
    'server': "errors.serverError", // Це припускає, що "errors.serverError" є у файлі errors.json
    'unauthorized': "errors.unauthorized", // Це припускає, що "errors.unauthorized" є у файлі errors.json
    'default': "errors.unknownError" // Це припускає, що "errors.unknownError" є у файлі errors.json
  };

  const messageKey = errorMap[errorKey] || errorMap['default'];
  return t(messageKey);
};
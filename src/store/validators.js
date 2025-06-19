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
    errors.firstName = t("validation:firstName.required"); // Залишається "validation"
  } else if (data.first_name.trim().length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    errors.firstName = t("validation:firstName.tooShort"); // Залишається "validation"
  } else if (!VALIDATION_RULES.NAME_REGEX.test(data.first_name.trim())) {
    errors.firstName = t("validation:firstName.invalidChars"); // Залишається "validation"
  }

  if (!data.last_name?.trim()) {
    errors.lastName = t("validation:lastName.required"); // Залишається "validation"
  } else if (data.last_name.trim().length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    errors.lastName = t("validation:lastName.tooShort"); // Залишається "validation"
  } else if (!VALIDATION_RULES.NAME_REGEX.test(data.last_name.trim())) {
    errors.lastName = t("validation:lastName.invalidChars"); // Залишається "validation"
  }

  if (!data.email?.trim()) {
    errors.email = t("validation:email.required"); // Залишається "validation"
  } else if (!VALIDATION_RULES.EMAIL_REGEX.test(data.email.trim())) {
    errors.email = t("validation:email.invalid"); // Залишається "validation"
  }

  if (data.album_number && !VALIDATION_RULES.ALBUM_NUMBER_REGEX.test(data.album_number.trim())) {
    errors.albumNumber = t("validation:albumNumber.invalid"); // Залишається "validation"
  } else if (data.isStudent && !data.album_number?.trim()) {
      errors.albumNumber = t("validation:albumNumber.required"); // Залишається "validation"
  }

  return errors;
};

export const validatePassword = (password, confirmPassword, t) => {
  const errors = {};

  if (!password) {
    errors.password = t("validationNewPassword:password.required"); // **Змінено** на validationNewPassword
  } else if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    errors.password = t("validationNewPassword:password.requirements.length"); // **Змінено** на validationNewPassword
  }

  if (!confirmPassword) {
    errors.confirmPassword = t("validationNewPassword:password.confirmPassword.notMatch"); // **Змінено** на validationNewPassword
  } else if (password !== confirmPassword) {
    errors.confirmPassword = t("validationNewPassword:password.confirmPassword.notMatch"); // **Змінено** на validationNewPassword
  }

  return errors;
};

export const getSuccessMessage = (t, type = 'profile') => {
  return type === 'password'
    ? t("validationNewPassword:password.change.success") // **Змінено** на validationNewPassword
    : t("validationNewPassword:password.change.updatesuccess"); // **Змінено** на validationNewPassword
};

export const getErrorMessage = (t, errorKey) => {
  const errorMap = {
    'invalidCurrent': "validationNewPassword:password.change.invalidCurrent", // **Змінено** на validationNewPassword
    'sameAsOld': "validationNewPassword:password.change.sameAsOld", // **Змінено** на validationNewPassword
    'network': "errors.networkError",
    'server': "errors.serverError",
    'unauthorized': "errors.unauthorized",
    'default': "errors.unknownError"
  };

  const messageKey = errorMap[errorKey] || errorMap['default'];
  return t(messageKey);
};
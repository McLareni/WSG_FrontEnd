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
    errors.firstName = t("firstName.required");
  } else if (data.first_name.trim().length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    errors.firstName = t("firstName.tooShort");
  } else if (!VALIDATION_RULES.NAME_REGEX.test(data.first_name.trim())) {
    errors.firstName = t("firstName.invalidChars");
  }

  if (!data.last_name?.trim()) {
    errors.lastName = t("lastName.required");
  } else if (data.last_name.trim().length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    errors.lastName = t("lastName.tooShort");
  } else if (!VALIDATION_RULES.NAME_REGEX.test(data.last_name.trim())) {
    errors.lastName = t("lastName.invalidChars");
  }

  if (!data.email?.trim()) {
    errors.email = t("email.required");
  } else if (!VALIDATION_RULES.EMAIL_REGEX.test(data.email.trim())) {
    errors.email = t("email.invalid");
  }

  if (data.album_number && !VALIDATION_RULES.ALBUM_NUMBER_REGEX.test(data.album_number.trim())) {
    errors.albumNumber = t("albumNumber.invalid");
  }

  return errors;
};

export const validatePassword = (password, confirmPassword, t) => {
  const errors = {};

  if (!password) {
    errors.password = t("password.required");
  } else if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    errors.password = t("password.requirements.length");
  }

  if (!confirmPassword) {
    errors.confirmPassword = t("password.confirmPassword.notMatch");
  } else if (password !== confirmPassword) {
    errors.confirmPassword = t("password.confirmPassword.notMatch");
  }

  return errors;
};

export const getSuccessMessage = (t, type = 'profile') => {
  return type === 'password' 
    ? t("password.change.success") 
    : t("password.change.updatesuccess");
};

export const getErrorMessage = (t, errorKey) => {
  const errorMap = {
    'invalidCurrent': "password.change.invalidCurrent",
    'sameAsOld': "password.change.sameAsOld",
    'network': "server.error",
    'server': "errors.serverError",
    'unauthorized': "errors.unauthorized",
    'default': "errors.unknownError"
  };

  const messageKey = errorMap[errorKey] || errorMap['default'];
  return t(messageKey);
};
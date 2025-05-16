export const ERROR_MESSAGES = {
  // Авторизація
  INVALID_CREDENTIALS: 'errors.invalidCredentials',
  EMAIL_NOT_VERIFIED: 'errors.emailNotVerified',
  LOGOUT_FAILED: 'errors.logoutFailed',
  
  // Профіль
  PROFILE_UPDATE_FAILED: 'errors.updateFailed',
  PASSWORD_CHANGE_FAILED: 'errors.passwordChangeFailed',
  PASSWORD_TOO_SHORT: 'password.requirements.length',
  PASSWORDS_NOT_MATCH: 'errors.passwordsNotMatch',
  INVALID_ALBUM_NUMBER: 'validation.errors.invalidAlbumNumber',
  
  // Загальні
  SERVER_ERROR: 'server.error',
  REQUIRED_FIELDS: 'errors.fillRequiredFields',
  UNKNOWN_ERROR: 'errors.unknownError',
};

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
};
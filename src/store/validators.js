import { ERROR_MESSAGES, VALIDATION_RULES } from './constants';

export const validateProfileData = (data) => {
  if (!data.first_name || !data.last_name) {
    throw new Error(ERROR_MESSAGES.REQUIRED_FIELDS);
  }

  if (data.first_name.length < VALIDATION_RULES.NAME_MIN_LENGTH || 
      data.last_name.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    throw new Error('firstName.tooShort');
  }
};

export const validatePassword = (password, confirmPassword) => {
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    throw new Error(ERROR_MESSAGES.PASSWORD_TOO_SHORT);
  }

  if (password !== confirmPassword) {
    throw new Error(ERROR_MESSAGES.PASSWORDS_NOT_MATCH);
  }
};
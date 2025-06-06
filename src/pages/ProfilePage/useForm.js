import { useCallback } from 'react';
import { VALIDATION_RULES } from "../../store/validators";

export const usePasswordValidation = (formData, t) => {
  return useCallback(() => {
    const newErrors = {};
    const { currentPassword, newPassword, confirmPassword } = formData;

    // Валідація поточного пароля
    if (!currentPassword.trim()) {
      newErrors.currentPassword = t('validation:password.change.currentRequired');
    } else if (currentPassword.length < 8) {
      newErrors.currentPassword = t('validation:password.requirements.length');
    }

    // Валідація нового пароля
    if (!newPassword) {
      newErrors.newPassword = t('validation:password.required');
    } else {
      if (newPassword.length < 8) {
        newErrors.newPassword = t('validation:password.requirements.length');
      }
      if (newPassword === currentPassword) {
        newErrors.newPassword = t('validation:password.change.sameAsOld');
      }
    }

    // Валідація підтвердження
    if (!confirmPassword) {
      newErrors.confirmPassword = t('validation:password.confirmPassword.notMatch');
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = t('validation:password.confirmPassword.notMatch');
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
      if (error.message.includes('validation:')) {
        setErrors({
          currentPassword: error.message.includes('invalidCurrent') ? 
            t('validation:password.change.invalidCurrent') : undefined,
          newPassword: error.message.includes('sameAsOld') ? 
            t('validation:password.change.sameAsOld') : undefined
        });
      }
      return false;
    }
  }, [formData, validateForm, changePassword, t, setErrors, navigate]);
};


// useLoginForm.js
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../../store/useAuthStore';

export const useLoginForm = () => {
  const { t } = useTranslation(["validation"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuthStore();

  const validate = (email, password) => {
    if (!email.trim() && !password.trim()) return { error: t("validation:errors.fillAllFields"), fieldErrors: { email: true, password: true } };
    if (!email.trim()) return { error: t("validation:errors.emailRequired"), fieldErrors: { email: true, password: false } };
    if (!password.trim()) return { error: t("validation:errors.passwordRequired"), fieldErrors: { email: false, password: true } };
    return null;
  };

  const handleLogin = async (email, password) => {
  const validationResult = validate(email, password);
  if (validationResult) return { success: false, ...validationResult };

  setIsSubmitting(true);
  
  try {
    const result = await login(email, password);
    
    if (!result.success) {
      const isInvalidCredentials = result.error.includes('Invalid');
      return { 
        success: false, 
        error: isInvalidCredentials 
          ? t("validation:errors.invalidCredentials") 
          : result.error || t("validation:errors.serverError"),
        fieldErrors: {
          email: isInvalidCredentials,
          password: isInvalidCredentials
        }
      };
    }
    
    return { success: true };
  } catch (error) {
    return { 
      success: false,
      error: error.message || t("validation:errors.serverError"),
      fieldErrors: { email: false, password: false }
    };
  } finally {
    setIsSubmitting(false);
  }
};

  return {
    isSubmitting,
    handleLogin
  };
};
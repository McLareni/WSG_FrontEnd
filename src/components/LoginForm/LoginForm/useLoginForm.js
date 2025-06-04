import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../../store/useAuthStore';

export const useLoginForm = () => {
  const { t } = useTranslation(["validation"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuthStore();

  const handleLogin = async (email, password) => {
    setIsSubmitting(true);
    
    try {
      const result = await login(email, password);
      
      if (!result.success) {
        const errorType = result.error?.toLowerCase().includes('invalid') 
          ? 'invalidCredentials' 
          : 'serverError';
        return { 
          success: false, 
          errorType,
          message: t(`validation:errors.${errorType}`)
        };
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false,
        errorType: 'serverError',
        message: t("validation:errors.serverError")
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
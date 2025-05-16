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
        // Явно повертаємо помилку для відображення
        return { 
          success: false, 
          error: result.error === 'Invalid login credentials' 
            ? t("validation:errors.invalidCredentials") 
            : t("validation:errors.serverError")
        };
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false,
        error: t("validation:errors.serverError")
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
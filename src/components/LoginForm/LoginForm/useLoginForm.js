import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../supabaseClient';
import useAuthStore from '../../../store/authStore';

export const useLoginForm = () => {
  const { t, i18n } = useTranslation(["validation"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser, setSession } = useAuthStore();

  // Додано ефект для скидання станів при зміні мови
  useEffect(() => {
    setIsSubmitting(false);
  }, [i18n.language]);

  const validateForm = (email, password) => {
    const errors = {};
    let hasErrors = false;

    if (!email.trim()) {
      errors.email = true;
      hasErrors = true;
    }

    if (!password) {
      errors.password = true;
      hasErrors = true;
    }

    return { isValid: !hasErrors, errors };
  };

  const handleLogin = async (email, password) => {
    setIsSubmitting(true);
    
    const { isValid, errors } = validateForm(email, password);
    if (!isValid) {
      setIsSubmitting(false);
      return { 
        success: false, 
        error: t("validation:errors.fillAllFields"),
        fieldErrors: errors
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) throw error;

      setSession(data.session);
      setUser(data.user);
      
      return { success: true };

    } catch (error) {
      console.error('Login error:', error);
      
      let errorKey = 'serverError';
      if (error.message.includes('Invalid login credentials')) {
        errorKey = 'invalidCredentials';
      }
      
      return { 
        success: false,
        error: t(`validation:errors.${errorKey}`)
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
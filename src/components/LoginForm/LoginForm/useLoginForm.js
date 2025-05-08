import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../supabaseClient';

export const useLoginForm = () => {
  const { t } = useTranslation('validation');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    if (name === 'email' && value) delete newErrors.email;
    if (name === 'password' && value) delete newErrors.password;

    setErrors(newErrors);
    return newErrors;
  };

  const validateForm = (formData) => {
    const newErrors = {};
    let hasErrors = false;

    if (!formData.email) hasErrors = true;
    if (!formData.password) hasErrors = true;

    setErrors(newErrors);
    return { isValid: !hasErrors, errors: newErrors };
  };

  const handleLogin = async (formData) => {
    const { isValid } = validateForm(formData);
    if (!isValid) {
      return {
        success: false,
        error: t('errors.formErrors'),
        errorKey: 'errors.formErrors'
      };
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      let errorKey = 'login.failed';

      if (error.message.includes('Email not confirmed')) {
        errorKey = 'login.emailNotVerified';
      } else if (error.message.includes('too many requests')) {
        errorKey = 'server.tooManyRequests';
      } else if (error.message.includes('Invalid login credentials')) {
        errorKey = 'errors.invalidCredentials';
      }

      return {
        success: false,
        error: t(errorKey),
        errorKey
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateErrorsOnLanguageChange = () => {
    setErrors((prevErrors) => ({ ...prevErrors }));
  };

  return {
    isSubmitting,
    errors,
    touched,
    setTouched,
    validateField,
    handleLogin,
    updateErrorsOnLanguageChange
  };
};

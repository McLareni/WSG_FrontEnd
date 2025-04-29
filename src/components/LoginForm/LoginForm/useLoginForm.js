import { useState, useEffect } from 'react';
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
    
    if (name === 'email') {
      if (!value) {
        newErrors.email = t('email.required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors.email = t('email.invalid');
      } else {
        delete newErrors.email;
      }
    }

    if (name === 'password') {
      if (!value) {
        newErrors.password = t('password.required');
      } else if (value.length < 8) {
        newErrors.password = t('password.tooShort');
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
    return newErrors;
  };

  const validateForm = (formData) => {
    const newErrors = {};
    let hasErrors = false;
    
    if (!formData.email) {
      newErrors.email = t('email.required');
      hasErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('email.invalid');
      hasErrors = true;
    }

    if (!formData.password) {
      newErrors.password = t('password.required');
      hasErrors = true;
    } else if (formData.password.length < 8) {
      newErrors.password = t('password.tooShort');
      hasErrors = true;
    }

    setErrors(newErrors);
    return { 
      isValid: !hasErrors, 
      errors: newErrors,
      isFormEmpty: !formData.email && !formData.password
    };
  };

  const handleLogin = async (formData) => {
    const { isValid, isFormEmpty } = validateForm(formData);
    
    if (isFormEmpty) {
      return { success: false, error: 'empty_form' };
    }
    
    if (!isValid) {
      return { success: false, error: 'validation' };
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message.includes('Invalid login credentials') 
          ? 'invalid_credentials' 
          : 'unknown' 
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    errors,
    touched,
    setTouched,
    validateField,
    handleLogin,
  };
};
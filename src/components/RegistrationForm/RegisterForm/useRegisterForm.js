import { useState, useCallback, useEffect } from 'react';
import { validateRegisterForm } from '../../../utils/registerValidation';
import registerRequest from '../../../utils/registerRequest';
import { useAuthToast } from '../../UI/ToastAuth/ToastAuth';

export const useRegisterForm = (t, navigate) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: '',
    isTeacher: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const authToast = useAuthToast();

  useEffect(() => {
    const newErrors = validateRegisterForm(formData, t);
    setErrors(newErrors);
  }, [formData, t]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    if (name === 'studentId' && !formData.isTeacher) {
      if (value && !/^\d*$/.test(value)) return;
      if (value.length > 6) return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
      ...(name === 'isTeacher' && checked ? { studentId: '' } : {})
    }));

    setTouched(prev => ({ ...prev, [name]: true }));
  }, [formData.isTeacher]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const isFormValid = useCallback(() => {
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
    if (!formData.isTeacher) requiredFields.push('studentId');

    return requiredFields.every(field => 
      formData[field]?.toString().trim() !== ''
    ) && Object.values(errors).every(err => !err);
  }, [formData, errors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      studentId: true,
      email: true,
      password: true,
      confirmPassword: true
    });
  
    if (!isFormValid()) {
      if (Object.keys(errors).length > 0) {
        authToast.error(t('errors.formErrors')); 
      }
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      await registerRequest({
        ...formData,
        studentId: formData.isTeacher ? null : formData.studentId
      });
  
      authToast.success(t('registration.success', { 
        firstName: formData.firstName,
        lastName: formData.lastName
      }));
  
      navigate('/login'); 
      
    } catch (error) {
      
      const errorMessage = error.translationKey 
        ? t(error.translationKey, error.translationParams || {}) 
        : t('common.unknownError');
      
      authToast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, authToast, isFormValid, navigate, t, errors]);

  return {
    formData,
    errors,
    isSubmitting,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isFormValid
  };
};
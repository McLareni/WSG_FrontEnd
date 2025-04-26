import { useState, useCallback } from 'react';
import { validateRegisterForm, validateField } from '../../../utils/registerValidation';
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
  const authToast = useAuthToast();

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prevFormData => {
      const updatedFormData = {
        ...prevFormData,
        [name]: newValue
      };

      if (name === 'isTeacher' && checked) {
        updatedFormData.studentId = '';
      }

      return updatedFormData;
    });

    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      const updatedFormData = { ...formData, [name]: newValue, ...(name === 'isTeacher' && checked && { studentId: '' }) };

      const fieldError = validateField(name, newValue, updatedFormData, t);
      Object.assign(newErrors, fieldError);

      if (name === 'password') {
        Object.assign(newErrors, validateField('confirmPassword', updatedFormData.confirmPassword, updatedFormData, t));
      } 
      else if (name === 'confirmPassword') {
        Object.assign(newErrors, validateField('password', updatedFormData.password, updatedFormData, t));
      }

      if (name === 'isTeacher') {
        newErrors.studentId = '';
      }

      Object.keys(newErrors).forEach(key => {
        if (newErrors[key] === '') delete newErrors[key];
      });

      return newErrors;
    });
  }, [t, formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const formDataToValidate = formData.isTeacher
      ? { ...formData, studentId: '' }
      : formData;

    const validationErrors = validateRegisterForm(formDataToValidate, t);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await registerRequest(formData);

        authToast.success('registration.success', {
          firstName: formData.firstName,
          lastName: formData.lastName
        });

        // Перенаправлення після успішної реєстрації
        navigate('/login');

      } catch (error) {
        console.error('Registration error:', error);

        authToast.error('registration.failed', {
          error: error.message
        });

        setErrors(prev => ({ ...prev, form: error.message }));
      }
    }
  }, [formData, t, authToast, navigate]);

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    setFormData,
    setErrors
  };
};

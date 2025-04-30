import { useState, useCallback, useEffect } from 'react';
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

    const allFieldsFilled = requiredFields.every(field => 
      formData[field]?.toString().trim() !== ''
    );

    const noErrors = Object.values(errors).every(err => !err);

    return allFieldsFilled && noErrors;
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
      authToast.error('errors.formErrors');
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      await registerRequest({
        ...formData,
        studentId: formData.isTeacher ? null : formData.studentId
      });
      
      // Використовуємо navigate з state замість window.location.href
      navigate('/login', {
        state: {
          fromRegistration: true,
          firstName: formData.firstName,
          lastName: formData.lastName
        }
      });
      
    } catch (error) {
      authToast.error('registration.failed', { error: error.message });
      setIsSubmitting(false);
    }
  }, [formData, authToast, t, isFormValid, navigate]);

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
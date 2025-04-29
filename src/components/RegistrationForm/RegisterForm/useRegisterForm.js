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

  // Реальний час валідації при зміні даних
  useEffect(() => {
    const newErrors = validateRegisterForm(formData, t);
    setErrors(newErrors);
  }, [formData, t]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    // Обмеження для номеру альбому (тільки цифри, максимум 6)
    if (name === 'studentId' && !formData.isTeacher) {
      if (value && !/^\d*$/.test(value)) return;
      if (value.length > 6) return;
    }

    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: newValue
      };
      if (name === 'isTeacher' && checked) {
        updated.studentId = '';
      }
      return updated;
    });

    setTouched(prev => ({ ...prev, [name]: true }));
  }, [formData.isTeacher]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const isFormValid = useCallback(() => {
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
    if (!formData.isTeacher) requiredFields.push('studentId');

    // Перевірка заповнення полів
    const allFieldsFilled = requiredFields.every(field => 
      formData[field]?.toString().trim() !== ''
    );

    // Перевірка наявності помилок
    const noErrors = Object.values(errors).every(err => !err);

    return allFieldsFilled && noErrors;
  }, [formData, errors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // Позначити всі поля як touched
    setTouched({
      firstName: true,
      lastName: true,
      studentId: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    if (!isFormValid()) {
      authToast.error(t('errors.formErrors'));
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
      
      navigate('/login?registrationSuccess=true', {
        state: { registeredEmail: formData.email }
      });
    } catch (error) {
      authToast.error(t('registration.failed', { error: error.message }));
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, authToast, navigate, t, isFormValid]);

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
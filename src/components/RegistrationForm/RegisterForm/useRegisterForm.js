import { useState, useCallback } from 'react';
import { validateRegisterForm, validateField } from '../../../utils/registerValidation';

export const useRegisterForm = (t) => {
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

      // Валідуємо змінені поля
      const fieldError = validateField(name, newValue, updatedFormData, t);
      Object.assign(newErrors, fieldError);

      // Спеціальні випадки валідації
      if (name === 'password') {
        const confirmPwdError = validateField(
          'confirmPassword',
          updatedFormData.confirmPassword,
          updatedFormData,
          t
        );
        Object.assign(newErrors, confirmPwdError);
      } 
      else if (name === 'confirmPassword') {
        const pwdError = validateField(
          'password',
          updatedFormData.password,
          updatedFormData,
          t
        );
        Object.assign(newErrors, pwdError);
      }

      // Якщо це чекбокс "Я викладач", очищаємо помилку для studentId
      if (name === 'isTeacher') {
        newErrors.studentId = '';
      }

      // Видаляємо пусті помилки
      Object.keys(newErrors).forEach(key => {
        if (newErrors[key] === '') {
          delete newErrors[key];
        }
      });

      return newErrors;
    });
  }, [t, formData]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    // Для викладачів ігноруємо валідацію studentId
    const formDataToValidate = formData.isTeacher 
      ? { ...formData, studentId: '' }
      : formData;

    const validationErrors = validateRegisterForm(formDataToValidate, t);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log('Form is valid', formData);
      // Тут буде логіка відправки форми
    }
  }, [formData, t]);

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    setFormData,
    setErrors
  };
};
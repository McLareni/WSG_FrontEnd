import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
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
  const [submitError, setSubmitError] = useState('');
  const authToast = useAuthToast();

  const validateRegisterForm = useCallback((formData, t) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // First name validation
    if (!formData.firstName.trim()) {
      errors.firstName = t('validation:firstName.required');
    } else if (formData.firstName.length < 2 || formData.firstName.length > 50) {
      errors.firstName = t('validation:firstName.tooShort');
    } else if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ'-]+$/.test(formData.firstName)) {
      errors.firstName = t('validation:firstName.invalidChars');
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      errors.lastName = t('validation:lastName.required');
    } else if (formData.lastName.length < 2 || formData.lastName.length > 50) {
      errors.lastName = t('validation:lastName.tooShort');
    } else if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ'-]+$/.test(formData.lastName)) {
      errors.lastName = t('validation:lastName.invalidChars');
    }

    // Album number validation (only when not teacher)
    if (!formData.isTeacher) {
      if (!formData.studentId.trim()) {
        errors.studentId = t('validation:albumNumber.required');
      } else if (!/^\d{6}$/.test(formData.studentId)) {
        errors.studentId = t('validation:albumNumber.invalid');
      }
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = t('validation:email.required');
    } else if (!emailRegex.test(formData.email)) {
      errors.email = t('validation:email.invalid');
    }

    // Password validation
    if (!formData.password) {
      errors.password = t('validation:password.required');
    } else if (formData.password.length < 8) {
      errors.password = t('validation:password.requirements.length');
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = t('validation:password.requirements.uppercase');
    } else if (!/[a-z]/.test(formData.password)) {
      errors.password = t('validation:password.requirements.lowercase');
    } else if (!/\d/.test(formData.password)) {
      errors.password = t('validation:password.requirements.digit');
    } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
      errors.password = t('validation:password.requirements.special');
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = t('validation:password.confirmPassword.notMatch');
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('validation:password.confirmPassword.notMatch');
    }

    return errors;
  }, [t]);

  useEffect(() => {
    const newErrors = validateRegisterForm(formData, t);
    setErrors(newErrors);
  }, [formData, t, validateRegisterForm]);

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
    setSubmitError('');
  }, [formData.isTeacher]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const isFormValid = useCallback(() => {
    return Object.values(errors).every(err => !err) &&
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.password.trim() !== '' &&
      formData.confirmPassword.trim() !== '' &&
      (formData.isTeacher || formData.studentId.trim() !== '');
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

    const emptyFields = [
      !formData.firstName.trim() && 'firstName',
      !formData.lastName.trim() && 'lastName',
      !formData.email.trim() && 'email',
      !formData.password.trim() && 'password',
      !formData.confirmPassword.trim() && 'confirmPassword',
      !formData.isTeacher && !formData.studentId.trim() && 'studentId'
    ].filter(Boolean);

    if (emptyFields.length > 0) {
      setSubmitError('errors.fillAllFields');
      return;
    }

    if (Object.values(errors).some(err => err)) {
      setSubmitError('errors.formErrors');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // 1. Реєстрація в Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName
          }
        }
      });

      if (authError) throw authError;

      // 2. Додавання даних в таблицю user_details
      const { error: profileError } = await supabase
        .from('user_details')
        .insert([{
          user_id: authData.user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          album_number: formData.isTeacher ? null : formData.studentId,
          role: formData.isTeacher ? 'teacher' : 'student',
          confirmed: false
        }]);

      if (profileError) throw profileError;

      authToast.success(t('registration.success', { 
        firstName: formData.firstName,
        lastName: formData.lastName
      }));

      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorKey = 'errors.registrationFailed';
      if (error.message.includes('User already registered')) {
        errorKey = 'errors.emailExists';
      } else if (error.message.includes('password')) {
        errorKey = 'errors.passwordRequirements';
      } else if (error.code === 'PGRST204') {
        errorKey = 'errors.databaseConfiguration';
      }

      setSubmitError(errorKey);
      authToast.error(t(errorKey));
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, authToast, navigate, t, errors]);

  return {
    formData,
    errors,
    isSubmitting,
    touched,
    submitError,
    handleChange,
    handleBlur,
    handleSubmit,
    isFormValid
  };
};
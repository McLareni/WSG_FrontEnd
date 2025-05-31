import { useState, useCallback, useEffect } from 'react';

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

  const validateRegisterForm = useCallback((formData, t) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName.trim()) {
      errors.firstName = t('validation:firstName.required');
    } else if (formData.firstName.length < 2 || formData.firstName.length > 50) {
      errors.firstName = t('validation:firstName.tooShort');
    } else if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ'-]+$/.test(formData.firstName)) {
      errors.firstName = t('validation:firstName.invalidChars');
    }

    if (!formData.lastName.trim()) {
      errors.lastName = t('validation:lastName.required');
    } else if (formData.lastName.length < 2 || formData.lastName.length > 50) {
      errors.lastName = t('validation:lastName.tooShort');
    } else if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ'-]+$/.test(formData.lastName)) {
      errors.lastName = t('validation:lastName.invalidChars');
    }

    if (!formData.isTeacher) {
      if (!formData.studentId.trim()) {
        errors.studentId = t('validation:albumNumber.required');
      } else if (!/^\d{6}$/.test(formData.studentId)) {
        errors.studentId = t('validation:albumNumber.invalid');
      }
    }

    if (!formData.email.trim()) {
      errors.email = t('validation:email.required');
    } else if (!emailRegex.test(formData.email)) {
      errors.email = t('validation:email.invalid');
    }

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

    if (!formData.confirmPassword) {
      errors.confirmPassword = t('validation:password.confirmPassword.notMatch');
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('validation:password.confirmPassword.notMatch');
    }

    return errors;
  }, [t]);

  useEffect(() => {
    setErrors(validateRegisterForm(formData, t));
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
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.password.trim() &&
      formData.confirmPassword.trim() &&
      (formData.isTeacher || formData.studentId.trim());
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

  const newErrors = validateRegisterForm(formData, t);
  setErrors(newErrors);

  const hasEmpty = [
    !formData.firstName.trim(),
    !formData.lastName.trim(),
    !formData.email.trim(),
    !formData.password.trim(),
    !formData.confirmPassword.trim(),
    !formData.isTeacher && !formData.studentId.trim()
  ].some(Boolean);

  if (hasEmpty) {
    setSubmitError('errors.fillAllFields');
    return;
  }

  if (Object.values(newErrors).some(Boolean)) {
    setSubmitError('errors.formErrors');
    return;
  }

  setIsSubmitting(true);
  setSubmitError('');

  try {
    const response = await fetch(import.meta.env.VITE_REGISTER_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_API_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_API_KEY}`,
      },
      body: JSON.stringify({
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        album_number: formData.isTeacher ? "" : formData.studentId.trim(), 
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || 'Registration failed');
    }

    navigate('/login');
  } catch (error) {
    console.error('Registration error:', error);
    let message = error.message.toLowerCase();

    if (message.includes('email already exists')) {
      setSubmitError('emailExists');
    } else if (message.includes('password must')) {
      setSubmitError('errors.passwordRequirements');
    } else if (message.includes('invalid email')) {
      setSubmitError('validation:email.invalid');
    } else if (message.includes('first name') || message.includes('last name')) {
      setSubmitError('validation:firstName.invalidChars');
    } else if (message.includes('album number')) {
      setSubmitError('validation:albumNumber.invalid');
    } else {
      setSubmitError('errors.registrationFailed');
    }
  } finally {
    setIsSubmitting(false);
  }
}, [formData, validateRegisterForm, t, navigate]);

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

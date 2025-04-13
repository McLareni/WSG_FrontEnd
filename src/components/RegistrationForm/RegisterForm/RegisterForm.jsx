import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RegisterForm.module.css';
import RegisterHeader from '../RegisterHeader/RegisterHeader';
import RegisterInput from '../RegisterInput/RegisterInput';
import RegisterButton from '../RegisterButton/RegisterButton';
import RegisterFooter from '../RegisterFooter/RegisterFooter';
import { validateRegisterForm, validateField } from '../../../utils/registerValidation';

const RegisterForm = () => {
  const { t } = useTranslation(['adminUser', 'validation']);
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    const updatedFormData = {
      ...formData,
      [name]: newValue
    };

    // Очистити studentId, якщо вибрано "Я вчитель"
    if (name === 'isTeacher' && checked) {
      updatedFormData.studentId = '';
    }

    setFormData(updatedFormData);

    // Валідація
    const newErrors = { ...errors };

    const fieldError = validateField(name, newValue, updatedFormData, t);
    Object.assign(newErrors, fieldError);

    // Спеціальна логіка
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
    else if (name === 'isTeacher') {
      const studentIdError = validateField(
        'studentId',
        updatedFormData.studentId,
        updatedFormData,
        t
      );
      Object.assign(newErrors, studentIdError);
    }

    // Очистити помилки для валідних полів
    Object.keys(newErrors).forEach(key => {
      if (newErrors[key] === '') {
        delete newErrors[key];
      }
    });

    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateRegisterForm(formData, t);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log('Form is valid', formData);
      // Submit logic here
    }
  };

  return (
    <div className={styles.formContainer}>
      <RegisterHeader title={t('adminUser:common.welcome')} />

      <form onSubmit={handleSubmit} className={styles.form} noValidate autoComplete="off">
        <div className={styles.formColumns}>
          <div className={styles.formColumn}>
            <RegisterInput
              label={t('adminUser:form.firstName')}
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
            />

            <RegisterInput
              label={t('adminUser:form.lastName')}
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
            />

            <RegisterInput
              label={t('adminUser:form.albumNumber')}
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              disabled={formData.isTeacher}
              error={errors.studentId}
            />

            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="isTeacher"
                name="isTeacher"
                checked={formData.isTeacher}
                onChange={handleChange}
              />
              <label htmlFor="isTeacher">{t('adminUser:buttons.iAmTeacher')}</label>
            </div>
          </div>

          <div className={styles.formColumn}>
            <RegisterInput
              label={t('adminUser:form.email')}
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <RegisterInput
              label={t('adminUser:form.password')}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            <RegisterInput
              label={t('adminUser:form.confirmPassword')}
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
          </div>
        </div>

        <div className={styles['button-footer']}>
          <RegisterButton />
        </div>
      </form>

      <RegisterFooter />
    </div>
  );
};

export default RegisterForm;

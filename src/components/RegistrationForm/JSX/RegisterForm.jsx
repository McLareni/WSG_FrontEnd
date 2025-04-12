import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../CSS/RegisterForm.module.css';
import RegisterHeader from './RegisterHeader';
import RegisterInput from './RegisterInput';
import RegisterButton from './RegisterButton';
import RegisterFooter from './RegisterFooter';
import { validateRegisterForm, validateField } from './registerValidation';

const RegisterForm = () => {
  const { t } = useTranslation();
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Валідація при зміні поля
    if (errors[name]) {
      const fieldErrors = validateField(name, type === 'checkbox' ? checked : value, formData);
      setErrors(prev => ({ ...prev, ...fieldErrors }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateRegisterForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      console.log('Form is valid', formData);
      // Тут буде логіка відправки форми
    }
  };

  return (
    <div className={styles.formContainer}>
      <RegisterHeader title={t('welcome')} subtitle={t('loginPrompt')} />
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formColumns}>
          {/* Ліва колонка */}
          <div className={styles.formColumn}>
            <RegisterInput
              label={t('firstName')}
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
            />
            
            <RegisterInput
              label={t('lastName')}
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
            />
            
            <RegisterInput
              label={t('albumNumber')}
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
              <label htmlFor="isTeacher">{t('iAmTeacher')}</label>
            </div>
          </div>

          {/* Права колонка */}
          <div className={styles.formColumn}>
            <RegisterInput
              label={t('email')}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            
            <RegisterInput
              label={t('password')}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
            
            <RegisterInput
              label={t('confirmPassword')}
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
          </div>
        </div>
        
        <div className={styles['button-footer']}>
          <RegisterButton text={t('submit')} />
        </div>
      </form>
      
      <RegisterFooter 
        text={t('alreadyHaveAccount')} 
        linkText={t('login')} 
        link="/login" 
      />
    </div>
  );
};

export default RegisterForm;
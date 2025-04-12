import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'; // Додано імпорт useNavigate
import styles from '../CSS/LoginForm.module.css';
import LoginHeader from './LoginHeader';
import LoginInput from './LoginInput';
import LoginButton from './LoginButton';
import LoginFooter from './LoginFooter';
import { validateLoginForm, validateLoginField } from './loginValidation';

const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // Додано хук для навігації
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      const fieldErrors = validateLoginField(name, value);
      setErrors(prev => ({ ...prev, ...fieldErrors }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      console.log('Form is valid', formData);
      // Переадресація на /home при успішній валідації
      navigate('/home');
    }
  };

  return (
    <div className={styles.formContainer}>
      <LoginHeader 
        title={t('welcome')} 
        subtitle={t('loginPrompt')} 
      />
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div style={{ marginTop: '40px' }}>
          <LoginInput
            label={t('email')}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          
          <LoginInput
            label={t('password')}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
        </div>
        
        <div style={{ 
          marginTop: '30px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <LoginButton 
          text={t('submit')} />
        </div>
      </form>
      
      <LoginFooter 
        text={t('noAccount')} 
        linkText={t('registration')} 
        link="/register" 
      />
    </div>
  );
};

export default LoginForm;
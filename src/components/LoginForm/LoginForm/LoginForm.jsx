import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';
import LoginHeader from '../LoginHeader/LoginHeader';
import LoginInput from '../LoginInput/LoginInput';
import LoginButton from '../LoginButton/LoginButton';
import LoginFooter from '../LoginFooter/LoginFooter';
import { validateLoginForm, validateLoginField } from '../../../utils/loginValidation';

const LoginForm = () => {
  const { t } = useTranslation(['adminUser', 'validation']);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
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
      navigate('/home');
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.contentWrapper}>
        <LoginHeader 
          title={t('adminUser:common.welcome')} 
          subtitle={t('adminUser:common.loginPrompt')} 
        />
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <LoginInput
              label={t('adminUser:form.email')}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email && t(`validation:${errors.email}`)}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <LoginInput
              label={t('adminUser:form.password')}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password && t(`validation:${errors.password}`)}
            />
          </div>
          
          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
            <LoginButton />
          </div>
        </form>
      </div>
      
      <LoginFooter />
    </div>
  );
};

export default LoginForm;
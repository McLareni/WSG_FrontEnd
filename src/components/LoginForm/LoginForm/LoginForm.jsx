import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLoginForm } from '../LoginForm/useLoginForm';
import { useAuthToast, AuthToastContainer } from '../../UI/ToastAuth/ToastAuth';
import styles from './LoginForm.module.css';
import Header from '../../UI/LoginHeader/LoginHeader';
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';
import Footer from '../../UI/LoginFooter/LoginFooter';

const LoginForm = () => {
  const { t } = useTranslation(['adminUser', 'validation']);
  const navigate = useNavigate();
  const authToast = useAuthToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { 
    isSubmitting, 
    errors, 
    touched,
    setTouched,
    validateField,
    handleLogin 
  } = useLoginForm();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Позначити всі поля як touched при сабміті
    setTouched({
      email: true,
      password: true
    });

    const result = await handleLogin(formData);
  
  if (result.success) {
    const toastId = authToast.success('validation.login.success');
    // Зберігаємо ID тоста в localStorage
    localStorage.setItem('successToastId', toastId);
    navigate('/home?loginSuccess=true');
  } else {
      switch (result.error) {
        case 'empty_form':
          authToast.error('errors.emptyForm');
          break;
        case 'validation':
          authToast.error('errors.formErrors');
          break;
        case 'invalid_credentials':
          authToast.error('errors.invalidCredentials');
          break;
        default:
          authToast.error('common.unknownError');
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <Header 
          title={t('adminUser:common.welcome')}
          subtitle={t('adminUser:common.loginPrompt')}
          variant="login"
        />
        
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <Input
            label={t('adminUser:form.email')}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email ? errors.email : ''}
            required
            autoComplete="username"
          />
          
          <Input
            label={t('adminUser:form.password')}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password ? errors.password : ''}
            required
            autoComplete="current-password"
          />
          
          <div className={styles.buttonWrapper}>
            <Button 
              type="submit" 
              variant="login"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? t('adminUser:buttons.loggingIn') : t('adminUser:buttons.login')}
            </Button>
          </div>
        </form>

        <Footer variant="login" />
      </div>

      <AuthToastContainer />
    </div>
  );
};

export default LoginForm;
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';
import Header from '../../UI/LoginHeader/LoginHeader';
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';
import Footer from '../../UI/LoginFooter/LoginFooter';

const LoginForm = () => {
  const { t } = useTranslation(['adminUser']);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Просто перенаправляємо на /home при сабміті
    navigate('/home');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <Header 
          title={t('adminUser:common.welcome')}
          subtitle={t('adminUser:common.loginPrompt')}
          variant="login"
        />
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label={t('adminUser:form.email')}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          
          <Input
            label={t('adminUser:form.password')}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          
          <div className={styles.buttonWrapper}>
            <Button type="submit" variant="login">
              {t('adminUser:buttons.login')}
            </Button>
          </div>
        </form>
        
        <Footer variant="login" />
      </div>
    </div>
  );
};

export default LoginForm;
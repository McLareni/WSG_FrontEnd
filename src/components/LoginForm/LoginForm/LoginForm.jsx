import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';
import Header from '../../UI/Header/Header';
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';
import Footer from '../../UI/Footer/Footer';
import { validateLoginForm, validateLoginField } from '../../../utils/loginValidation';

const LoginForm = React.memo(() => {
  const { t } = useTranslation(['adminUser', 'validation']);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    const fieldErrors = validateLoginField(name, value);
    setErrors(prev => ({ ...prev, ...fieldErrors }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const validationErrors = validateLoginForm(formData, t);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      try {
        navigate('/home');
      } catch (error) {
        setErrors({ server: error.message });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  }, [formData, t, navigate]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <Header 
          title={t('adminUser:common.welcome')}
          subtitle={t('adminUser:common.loginPrompt')}
          variant="login"
        />
        
        <form onSubmit={handleSubmit} className={styles.form}>
          {errors.server && (
            <div className={styles.errorMessage}>{errors.server}</div>
          )}
          
          <Input
            label={t('adminUser:form.email')}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email && t(`validation:${errors.email}`)}
          />
          
          <Input
            label={t('adminUser:form.password')}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password && t(`validation:${errors.password}`)}
          />
          
          <div className={styles.buttonWrapper}>
            <Button 
              type="submit"
              variant="login"
              disabled={isSubmitting || Object.keys(errors).length > 0}
            >
              {t('adminUser:buttons.login')}
            </Button>
          </div>
        </form>
        
        <Footer variant="login" />
      </div>
    </div>
  );
});

export default LoginForm;
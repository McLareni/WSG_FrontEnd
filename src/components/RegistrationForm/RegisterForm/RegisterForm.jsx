import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RegisterForm.module.css';
import Header from '../../UI/LoginHeader/LoginHeader';
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';
import Footer from '../../UI/LoginFooter/LoginFooter';
import Checkbox from '../../UI/Checkbox/Checkbox';
import { useRegisterForm } from './useRegisterForm';
import { AuthToastContainer } from '../../UI/ToastAuth/ToastAuth';

const RegisterForm = () => {
  const { t } = useTranslation(['validation', 'adminUser']);
  const {
    formData,
    errors,
    isSubmitting,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isFormValid
  } = useRegisterForm(t);

  // Special handler for names (only Latin letters)
  const handleNameChange = useCallback((e) => {
    const { name, value } = e.target;
    if (/^[a-zA-Z'-]*$/.test(value)) {
      handleChange(e);
    }
  }, [handleChange]);

  // Special handler for student ID (only numbers, max 6)
  const handleStudentIdChange = useCallback((e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 6) {
      handleChange(e);
    }
  }, [handleChange]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <Header 
          title={t('adminUser:common.welcome')}
          variant="register"
        />

        <form onSubmit={handleSubmit} className={styles.form} noValidate autoComplete="off">
          <div className={styles.formColumns}>
            <div className={styles.formColumn}>
              <Input
                label={t('adminUser:form.firstName')}
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleNameChange}
                onBlur={handleBlur}
                error={touched.firstName && errors.firstName}
                required
               
              />

              <Input
                label={t('adminUser:form.lastName')}
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleNameChange}
                onBlur={handleBlur}
                error={touched.lastName && errors.lastName}
                required
                
              />

              <Input
                label={t('adminUser:form.albumNumber')}
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleStudentIdChange}
                onBlur={handleBlur}
                disabled={formData.isTeacher}
                error={touched.studentId && errors.studentId}
                required={!formData.isTeacher}
               
                maxLength={6}
              />

              <Checkbox
                id="isTeacher"
                name="isTeacher"
                checked={formData.isTeacher}
                onChange={handleChange}
                label={t('adminUser:buttons.iAmTeacher')}
              />
            </div>

            <div className={styles.formColumn}>
              <Input
                label={t('adminUser:form.email')}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
                required
              />

              <Input
                label={t('adminUser:form.password')}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && errors.password}
                required
              />

              <Input
                label={t('adminUser:form.confirmPassword')}
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && errors.confirmPassword}
                required
              />
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <Button
              type="submit"
              variant="register"
              showTextSpan={true}
              loading={isSubmitting}
              disabled={!isFormValid || isSubmitting}
            >
              {t('adminUser:buttons.register')}
            </Button>
          </div>
        </form>
        
        <div className={styles.footerContainer}>
          <Footer variant="register" />
        </div>
      </div>
      
      <AuthToastContainer />
    </div>
  );
};

export default RegisterForm;
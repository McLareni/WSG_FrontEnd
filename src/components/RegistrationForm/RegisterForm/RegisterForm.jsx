import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterForm.module.css';
import Header from '../../UI/LoginHeader/LoginHeader';
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';
import Footer from '../../UI/LoginFooter/LoginFooter';
import Checkbox from '../../UI/Checkbox/Checkbox';
import { useRegisterForm } from './useRegisterForm';

const RegisterForm = () => {
  const { t } = useTranslation(['validation', 'adminUser']);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    formData,
    errors,
    isSubmitting,
    touched,
    submitError,
    handleChange,
    handleBlur,
    handleSubmit,
    isFormValid
  } = useRegisterForm(t, navigate);

  const handleNameChange = useCallback((e) => {
    const { name, value } = e.target;
    if (/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ'-]*$/.test(value)) {
      handleChange(e);
    }
  }, [handleChange]);

  const handleStudentIdChange = useCallback((e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 6) {
      handleChange(e);
    }
  }, [handleChange]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        {submitError && (
          <div className={styles.errorMessage}>
            {t(`validation:${submitError}`)}
          </div>
        )}

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
                hasSoftError={submitError === 'errors.fillAllFields' && !formData.firstName}
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
                hasSoftError={submitError === 'errors.fillAllFields' && !formData.lastName}
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
                hasSoftError={submitError === 'errors.fillAllFields' && !formData.studentId && !formData.isTeacher}
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
                hasSoftError={submitError === 'errors.fillAllFields' && !formData.email}
                required
              />

              <Input
                label={t('adminUser:form.password')}
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && errors.password}
                hasSoftError={submitError === 'errors.fillAllFields' && !formData.password}
                required
                showPasswordToggle={true}
                onTogglePassword={togglePasswordVisibility}
                showPassword={showPassword}
              />

              <Input
                label={t('adminUser:form.confirmPassword')}
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && errors.confirmPassword}
                hasSoftError={submitError === 'errors.fillAllFields' && !formData.confirmPassword}
                required
                showPasswordToggle={true}
                onTogglePassword={toggleConfirmPasswordVisibility}
                showPassword={showConfirmPassword}
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
    </div>
  );
};

export default RegisterForm;
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RegisterForm.module.css';
import Header from '../../UI/Header/Header';
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';
import Footer from '../../UI/Footer/Footer';
import Checkbox from '../../UI/Checkbox/Checkbox';
import { useRegisterForm } from './useRegisterForm';

const RegisterForm = () => {
  const { t } = useTranslation(['adminUser', 'validation']);
  const {
    formData,
    errors,
    handleChange,
    handleSubmit
  } = useRegisterForm(t);

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
                onChange={handleChange}
                error={errors.firstName}
              />

              <Input
                label={t('adminUser:form.lastName')}
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
              />

              <Input
                label={t('adminUser:form.albumNumber')}
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                disabled={formData.isTeacher}
                error={errors.studentId}
              />

              <Checkbox
                id="isTeacher"
                name="isTeacher"
                checked={formData.isTeacher}
                onChange={handleChange}
                label={t('adminUser:buttons.iAmTeacher')}
                error={!formData.isTeacher && errors.studentId}
              />
            </div>

            <div className={styles.formColumn}>
              <Input
                label={t('adminUser:form.email')}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />

              <Input
                label={t('adminUser:form.password')}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />

              <Input
                label={t('adminUser:form.confirmPassword')}
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <Button variant="register" showTextSpan={true} />
          </div>
        </form>
        
        <div className='.footerContainer'>
          <Footer variant="register" />
          </div>
      </div>

    
    </div>
  );
};

export default RegisterForm;
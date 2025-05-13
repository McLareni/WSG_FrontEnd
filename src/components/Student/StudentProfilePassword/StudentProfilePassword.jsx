import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './StudentProfilePassword.module.css'; 
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';


const StudentProfilePassword = () => {
  const { t } = useTranslation('tabProfile');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Password change submitted', formData);
    navigate('/teacher/profile');
  };

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.profileContainer}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}></div>
        </div>

        <form onSubmit={handleSubmit}>
          <section className={styles.section}>
            <h1 className={styles.title}>{t('student')}</h1>
            <div className={styles.inputGroup}>
              <Input
                label={t('currentPassword')}
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <Input
                label={t('newPassword')}
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <Input
                label={t('confirmPassword')}
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

           
          </section>

          <div className={styles.actions}>
            <Button 
              type="button" 
              variant="cancel"
              onClick={() => navigate('/student/profile')}
            >
              {t('buttons.cancel')}
            </Button>
            <Button 
              type="submit" 
              variant="saveChanges"
            >
              {t('buttons.saveChanges')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfilePassword;

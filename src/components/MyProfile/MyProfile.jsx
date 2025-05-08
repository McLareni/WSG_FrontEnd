import React from 'react';
import styles from './MyProfile.module.css';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import { useTranslation } from 'react-i18next';

const MyProfile = () => {
  const { t } = useTranslation('adminUser');

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.profileContainer}>
        {/* Аватарка */}
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}></div>
        </div>
        
        <h1 className={styles.title}>{t('profile.teacher')}</h1>
        
        <section className={styles.section}>
          <div className={styles.inputGroup}>
            <Input 
              label={t('profile.email')}
              name="email"
              type="email"
              value=""
              onChange={() => {}}
            />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.inputGroup}>
            <Input 
              label={t('profile.firstName')}
              name="firstName"
              value=""
              onChange={() => {}}
            />
            <Input 
              label={t('profile.lastName')}
              name="lastName"
              value=""
              onChange={() => {}}
            />
          </div>
        </section>

        <div className={styles.divider}></div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('profile.createdRooms')}</h2>
          <ul className={styles.roomsList}>
            <li className={styles.roomItem}>
              <span>Sala #122</span>
              <span className={styles.activeStatus}>{t('profile.active')}</span>
            </li>
            <li className={styles.roomItem}>
              <span>Sala #123</span>
              <span className={styles.activeStatus}>{t('profile.active')}</span>
            </li>
            <li className={styles.roomItem}>
              <span>Sala #124</span>
              <span className={styles.inactiveStatus}>{t('profile.inactive')}</span>
            </li>
          </ul>
        </section>

        <div className={styles.actions}>
          <Button variant="edit">{t('profile.edit')}</Button>
          <Button variant="changePassword">{t('profile.changePassword')}</Button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './TeacherProfileEdit.module.css';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';

const TeacherProfileEdit = () => {
  const { t } = useTranslation("tabProfile");
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Логіка збереження профілю
    console.log({ email, firstName, lastName });
  };

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.profileContainer}>
        {/* Аватарка */}
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}></div>
        </div>

        <form onSubmit={handleSubmit}>
          <section className={styles.section}>
            <h1 className={styles.title}>{t("teacher")}</h1>
            <div className={styles.inputGroup}>
              <Input
                label={t("email")}
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.inputGroup}>
              <Input
                label={t("firstName")}
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                label={t("lastName")}
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </section>

          <div className={styles.divider}></div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t("createdRooms")}</h2>
            <ul className={styles.roomsList}>
              <li className={styles.roomItem}>
                <span>Sala #122</span>
                <span className={styles.activeStatus}>{t("active")}</span>
              </li>
              <li className={styles.roomItem}>
                <span>Sala #123</span>
                <span className={styles.activeStatus}>{t("active")}</span>
              </li>
              <li className={styles.roomItem}>
                <span>Sala #124</span>
                <span className={styles.inactiveStatus}>{t("inactive")}</span>
              </li>
            </ul>
          </section>

          <div className={styles.actions}>
            <Button
              type="button"
              variant="cancel"
              onClick={() => navigate('/teacher/profile')}
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

export default TeacherProfileEdit;

import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TeacherProfile.module.css";
import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";
import { useTranslation } from "react-i18next";

const TeacherProfile = () => {
  const { t } = useTranslation("tabProfile");
  const navigate = useNavigate();

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.profileContainer}>
        {/* Аватарка */}
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}></div>
        </div>

       

        <section className={styles.section}>
        <h1 className={styles.title}>{t("teacher")}</h1>
          <div className={styles.inputGroup}>
            
            <Input
              label={t("email")}
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
              label={t("firstName")}
              name="firstName"
              value=""
              onChange={() => {}}
            />
            <Input
              label={t("lastName")}
              name="lastName"
              value=""
              onChange={() => {}}
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
            variant="edit"
            onClick={() => navigate("/teacher/profile/edit")}
          >
            {t("edit")}
          </Button>
          <Button
            variant="changePassword"
            onClick={() => navigate("/teacher/profile/password")}
          >
            {t("changePassword")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
import { useNavigate } from "react-router-dom";
import styles from "./StudentProfile.module.css";
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
        <h1 className={styles.title}>{t("student")}</h1>
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

      

        <div className={styles.actions}>
          <Button 
            variant="edit"
            onClick={() => navigate("/student/profile/edit")}
          >
            {t("edit")}
          </Button>
          <Button
            variant="changePassword"
            onClick={() => navigate("/student/profile/password")}
          >
            {t("changePassword")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
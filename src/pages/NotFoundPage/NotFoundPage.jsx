import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  const { t } = useTranslation("tabProfile");
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.code}>404</h1>
        <p className={styles.message}>{t("notFound.message")}</p>
        <button className={styles.button} onClick={handleGoHome}>
          {t("notFound.goHome")}
        </button>
      </div>
    </div>
  );
}

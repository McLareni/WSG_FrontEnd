import React from "react";
import styles from "./Header.module.css";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t } = useTranslation("homePage");
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <h1 className={styles.logo}>WorkRoom</h1>

        <nav className={styles.centerSection}>
          <a href="/" className={styles.navLink}>
            {t("header.home")}
          </a>
          <a href="/profile" className={styles.navLink}>
            {t("header.profile")}
          </a>
          <a href="/rooms" className={styles.navLink}>
            {t("header.room")}
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;

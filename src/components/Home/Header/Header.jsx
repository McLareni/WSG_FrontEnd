import React from "react";
import styles from "./Header.module.css";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import useAuthStore from "../../../store/useAuthStore";

const Header = () => {
  const { t } = useTranslation("homePage");
  const { user } = useAuthStore();

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <h1 className={styles.logo}>WorkRoom</h1>

        <nav className={styles.centerSection}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive && styles.active}`
            }
          >
            {t("header.home")}
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive && styles.active}`
            }
          >
            {t("header.profile")}
          </NavLink>
          {user?.role === "teacher" && (
            <NavLink
              to={"/create-room"}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive && styles.active}`
              }
            >
              {t("header.newRoom")}
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

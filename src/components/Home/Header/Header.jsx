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
        <nav className={styles.centerSection}>
          <NavLink to={"/"} className={styles.navLink}>
            <h1 className={styles.logo}>WorkRoom</h1>
          </NavLink>
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
          <NavLink
            to="/my-reservations"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive && styles.active}`
            }
          >
            {t("header.my-reservations")}
          </NavLink>
          <NavLink
            to="/notes"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive && styles.active}`
            }
          >
            {t("header.notes")}
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

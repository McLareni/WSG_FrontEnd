import React from "react";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <h1 className={styles.logo}>WorkRoom</h1>

        <nav className={styles.centerSection}>
          <a href="/" className={styles.navLink}>
            Strona główna
          </a>
          <a href="/profile" className={styles.navLink}>
            Mój profil
          </a>
          <a href="/rooms" className={styles.navLink}>
            Biura
          </a>
          <a href="/reservation" className={styles.navLink}>
            Reservation
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;

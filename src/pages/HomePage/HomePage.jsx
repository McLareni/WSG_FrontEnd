// src/pages/HomePage.jsx
import React from "react";
import Header from "../../components/Home/Header/Header";
import MainContent from "../../components/Home/HomeMainContent/MainContent";
import styles from "./HomePage.module.css";

const HomePage = () => {
  return (
    <div className={styles.homePage}>
      <Header />
      <div className={styles.content}>
        <MainContent />
      </div>
    </div>
  );
};

export default HomePage;

// src/pages/HomePage.jsx
import React from 'react';
import Header from '../../components/Home/Header/Header';
import MainContent from '../../components/Home/HomeMainContent/MainContent';
import Footer from '../../components/Home/HomeFooter/Footer';

const HomePage = () => {
  return (
    <div className="home-page">
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
};

export default HomePage;
// src/pages/HomePage.jsx
import React from 'react';
import Header from '../../components/Home/JSX/Header';
import MainContent from '../../components/Home/JSX/MainContent';
import Footer from '../../components/Home/JSX/Footer';

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
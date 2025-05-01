import React from 'react';
import { AuthToastContainer } from '../../UI/ToastAuth/ToastAuth';

const MainContent = () => {
  return (
    <main>
      <h1>Welcome to Home Page</h1>
      <AuthToastContainer />
    </main>
  );
};

export default MainContent;
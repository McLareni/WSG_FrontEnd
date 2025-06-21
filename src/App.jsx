import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RouterProvider } from 'react-router-dom';
import router from './router/router';
import { AuthToastContainer } from './components/UI/ToastAuth/ToastAuth';
import useAuthStore from './store/useAuthStore';
import { Loader } from './components/UI/Loader/Loader';

const devButtonStyle = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  zIndex: 1000,
  padding: '10px 15px',
  backgroundColor: '#ff4444',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  transition: 'all 0.3s ease',
  ':hover': {
    backgroundColor: '#cc0000'
  }
};

function App() {
  const { t } = useTranslation();
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const { checkSession, logout, isLoading } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkSession();
      } catch (error) {
        console.error(t('validation:errors.serverError'), error);
      } finally {
        setTimeout(() => {
          setIsAuthCheckComplete(true);
        }, 500); 
      }
    };

    initializeAuth();
  }, [checkSession, t]);

  if (!isAuthCheckComplete || isLoading) {
    return <Loader isLoading={!isAuthCheckComplete} />;
  }

  return (
    <>
      {import.meta.env.MODE === 'development' && (
        <button 
          onClick={logout}
          style={devButtonStyle}
          title="Тестовий логаут"
        >
          [DEV] Вийти
        </button>
      )}

      <RouterProvider router={router} />
      <AuthToastContainer />
    </>
  );
}

export default App;
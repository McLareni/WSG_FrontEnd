import { toast, ToastContainer } from 'react-toastify';
import { Slide } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';

export const useAuthToast = () => {
  const { t } = useTranslation('validation');
  
  const authToast = {
    success: (translationKey, data) => toast.success(t(translationKey, data), {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      transition: Slide,
      icon: "🔐"
    }),
    
    error: (translationKey, data) => toast.error(t(translationKey, data), {
      position: "top-right",
      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      transition: Slide,
      icon: "⚠️"
    })
  };

  return authToast;
};

export const AuthToastContainer = () => {
  return (
    <ToastContainer 
      position="top-right"
      autoClose={5000}
      newestOnTop
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover
      theme="colored"
      transition={Slide}
    />
  );
};
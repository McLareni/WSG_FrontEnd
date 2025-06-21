import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import { AuthToastContainer } from "./components/UI/ToastAuth/ToastAuth";
import useAuthStore from "./store/useAuthStore";
import { Loader } from "./components/UI/Loader/Loader";


function App() {
  const { t } = useTranslation();
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);
  const { checkSession, isLoading } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkSession();
      } catch (error) {
        console.error(t("validation:errors.serverError"), error);
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
      <RouterProvider router={router} />
      <AuthToastContainer />
    </>
  );
}

export default App;

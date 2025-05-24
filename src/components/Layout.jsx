import { Outlet } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher/LanguageSwitcher";
import useAuthStore from "../store/useAuthStore";
import { Loader } from "./UI/Loader/Loader";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Layout = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const { i18n } = useTranslation();
  const { isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      setAuthChecked(true);
    }
  }, [isLoading, i18n.language]);

  return (
    <div className="app">
      <LanguageSwitcher />
      <main>{isLoading || !authChecked ? <Loader /> : <Outlet />}</main>
    </div>
  );
};

export default Layout;

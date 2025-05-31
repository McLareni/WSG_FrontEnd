import { Outlet } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher/LanguageSwitcher";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useAuthStore from "../store/useAuthStore";

import { Loader } from "./UI/Loader/Loader";
import Header from "./Home/Header/Header";

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
    <div className="app" style={{ height: "100%" }}>
      <Header />
      <LanguageSwitcher />
      <main
        style={{
          width: "100%",
          height: "calc(100% - 92px)"
        }}
      >
        {isLoading || !authChecked ? <Loader /> : <Outlet />}
      </main>
    </div>
  );
};

export default Layout;

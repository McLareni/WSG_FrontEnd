import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLoginForm } from "../LoginForm/useLoginForm";
import { useAuthToast } from "../../UI/ToastAuth/ToastAuth";
import styles from "./LoginForm.module.css";
import Header from "../../UI/LoginHeader/LoginHeader";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import Footer from "../../UI/LoginFooter/LoginFooter";
import i18n from "i18next";
import { supabase } from "../../../supabaseClient";

const LoginForm = () => {
  const { t } = useTranslation(["adminUser", "validation"]);
  const navigate = useNavigate();
  const authToast = useAuthToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loginErrorKey, setLoginErrorKey] = useState("");

  const {
    isSubmitting,
    errors,
    touched,
    setTouched,
    validateField,
    handleLogin,
    updateErrorsOnLanguageChange,
  } = useLoginForm();

  // ===== Нова функція для отримання даних користувача ===== //
  const fetchUserDetails = async (accessToken) => {
    console.log("[1] Початок fetchUserDetails, токен:", accessToken?.slice(0, 10) + "...");
    
    try {
      const url = "https://wimurpvxsucfrpggrgqd.supabase.co/functions/v1/getuserdetails";
      console.log("[2] Виконується запит до:", url);
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });
      
      console.log("[3] Отримано відповідь, статус:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log("[4] Дані від сервера:", data);
      
      return data;
    } catch (error) {
      console.error("[5] Помилка у fetchUserDetails:", error);
      throw error;
    }
  };
  // ===== Кінець нової функції ===== //

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
    setLoginErrorKey("");
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("1. Початок обробки форми"); // Додано
    
    setTouched({ email: true, password: true });
    setLoginErrorKey("");
  
    console.log("2. Виклик handleLogin"); // Додано
    const result = await handleLogin(formData);
    console.log("3. Результат handleLogin:", result); // Додано
  
    if (result.success) {
      console.log("4. Успішний вхід, отримуємо сесію"); // Додано
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log("5. Отримана сесія:", session, "Помилка:", sessionError); // Додано
  
        if (sessionError || !session) {
          console.error("6. Помилка сесії:", sessionError); // Додано
          throw new Error("No session found");
        }
  
        console.log("7. Виклик fetchUserDetails з токеном:", session.access_token); // Додано
        const userDetails = await fetchUserDetails(session.access_token);
        console.log("8. Отримані дані користувача:", userDetails); // Додано
        
        localStorage.setItem("userDetails", JSON.stringify(userDetails));
        console.log("9. Дані збережено в localStorage"); // Додано
        
        authToast.success("login.success");
        navigate("/home");
      } catch (error) {
        console.error("10. Помилка в блоці try:", error); // Додано
        authToast.error("login.failedToFetchDetails");
      }
    } else {
      console.log("11. Помилка логування:", result.error); // Додано
      if (result.errorKey === "errors.invalidCredentials") {
        setLoginErrorKey(result.errorKey);
      } else {
        authToast.error(result.error);
      }
    }
  };

  useEffect(() => {
    updateErrorsOnLanguageChange();
  }, [i18n.language]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        {loginErrorKey && (
          <div className={styles.errorMessage}>
            {t(`validation:${loginErrorKey}`)}
          </div>
        )}

        <Header
          title={t("adminUser:common.welcome")}
          subtitle={t("adminUser:common.loginPrompt")}
        />

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <Input
            label={t("adminUser:form.email")}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error=""
            hasSoftError={touched.email && !formData.email}
            autoComplete="username"
          />

          <Input
            label={t("adminUser:form.password")}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error=""
            hasSoftError={touched.password && !formData.password}
            autoComplete="current-password"
          />

          <div className={styles.buttonWrapper}>
            <Button
              type="submit"
              variant="login"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {t("adminUser:buttons.login")}
            </Button>
          </div>
        </form>

        <Footer variant="login" />
      </div>
    </div>
  );
};

export default LoginForm;
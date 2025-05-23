import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./LoginForm.module.css";
import Header from "../../UI/LoginHeader/LoginHeader";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import Footer from "../../UI/LoginFooter/LoginFooter";
import { useLoginForm } from "./useLoginForm";

const LoginForm = React.memo(() => {
  const { t } = useTranslation(["adminUser", "validation"]);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: false,
    password: false
  });
  
  const { isSubmitting, handleLogin } = useLoginForm();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Скидаємо помилку тільки для цього поля
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: false }));
      if (formError === t("validation:errors.invalidCredentials")) {
        setFormError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await handleLogin(formData.email, formData.password);
    
    if (!result.success) {
      setFormError(result.error);
      if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
      }
      return;
    }
    
    // Скидаємо форму тільки при успішному логіні
    setFormData({ email: "", password: "" });
    setFormError("");
    setFieldErrors({ email: false, password: false });
    navigate(location.state?.from?.pathname || "/home", { replace: true });
  };

  const getErrorMessage = (fieldName) => {
    if (!fieldErrors[fieldName]) return "";
    return formError;
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        {formError && formError !== t("validation:errors.invalidCredentials") && (
          <div className={styles.errorMessage} role="alert">
            {formError}
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
            autoComplete="username"
            required
            error={fieldErrors.email}
            errorMessage={getErrorMessage("email")}
          />

          <Input
            label={t("adminUser:form.password")}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
            error={fieldErrors.password}
            errorMessage={getErrorMessage("password")}
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
});

export default LoginForm;
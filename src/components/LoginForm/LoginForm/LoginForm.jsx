import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./LoginForm.module.css";
import Header from "../../UI/LoginHeader/LoginHeader";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import Footer from "../../UI/LoginFooter/LoginFooter";
import { useLoginForm } from "./useLoginForm";

const LoginForm = React.memo(() => {
  const { t, i18n } = useTranslation(["adminUser", "validation"]);
  const navigate = useNavigate();
  const location = useLocation();
  const { isSubmitting, handleLogin } = useLoginForm();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState("");

  useEffect(() => {
    setFormError("");
  }, [i18n.language]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Базова перевірка на заповненість полів
    if (!formData.email.trim() || !formData.password.trim()) {
      setFormError(t("validation:errors.fillRequiredFields"));
      return;
    }

    const result = await handleLogin(formData.email, formData.password);
      
    if (!result.success) {
      setFormError(result.error);
      return;
    }

    navigate(location.state?.from?.pathname || "/home", { replace: true });
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        {/* Блок для відображення помилок */}
        {formError && (
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
          />

          <Input
            label={t("adminUser:form.password")}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
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
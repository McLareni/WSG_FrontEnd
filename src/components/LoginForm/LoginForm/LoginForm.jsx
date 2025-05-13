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

  const [fieldErrors, setFieldErrors] = useState({
    email: false,
    password: false
  });

  const [formError, setFormError] = useState("");

  // Скидаємо помилки при зміні мови
  useEffect(() => {
    setFormError("");
    setFieldErrors({ email: false, password: false });
  }, [i18n.language]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: false }));
    }
    
    if (formError) setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({ email: false, password: false });
    setFormError("");

    const result = await handleLogin(formData.email, formData.password);
      
    if (!result.success) {
      if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
      }
      
      if (result.error) {
        setFormError(result.error);
      }
    } else {
      navigate(location.state?.from?.pathname || "/home", { replace: true });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
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
            error={fieldErrors.email}
            autoComplete="username"
            required
          />

          <Input
            label={t("adminUser:form.password")}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={fieldErrors.password}
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
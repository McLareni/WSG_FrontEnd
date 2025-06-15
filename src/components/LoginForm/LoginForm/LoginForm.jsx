import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styles from "./LoginForm.module.css";
import Header from "../../UI/LoginHeader/LoginHeader";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import Footer from "../../UI/LoginFooter/LoginFooter";
import { useLoginForm } from "./useLoginForm";

const LoginForm = () => {
  const { t, i18n } = useTranslation(["adminUser", "validation"]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState({ type: null, message: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { isSubmitting, handleLogin } = useLoginForm();

  useEffect(() => {
    if (error.type) {
      setError(prev => ({
        ...prev,
        message: t(`validation:errors.${prev.type}`)
      }));
    }
  }, [i18n.language, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim() || !formData.password.trim()) {
      setError({
        type: 'fillAllFields',
        message: t("validation:errors.fillAllFields")
      });
      return;
    }

    const result = await handleLogin(formData.email, formData.password);
    
    if (!result.success) {
      setError({
        type: result.errorType,
        message: result.message
      });
    } else {
      navigate("/");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        {error.message && (
          <div className={styles.errorMessage} role="alert">
            {error.message}
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
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            error={error.type === 'fillAllFields' && !formData.email}
          />

          <Input
            label={t("adminUser:form.password")}
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            error={error.type === 'fillAllFields' && !formData.password}
            showPasswordToggle={true}
            onTogglePassword={togglePasswordVisibility}
            showPassword={showPassword}
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
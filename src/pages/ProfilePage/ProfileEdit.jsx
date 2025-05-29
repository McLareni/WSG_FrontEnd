import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ProfileLayout from "../../components/Profile/ProfileLayout";
import ProfileSection from "../../components/Profile/ProfileSection";
import Input from "../../components/UI/Input/Input";
import ProfileActions from "../../components/Profile/ProfileActions";
import useAuthStore from "../../store/useAuthStore";
import { ERROR_MESSAGES, VALIDATION_RULES } from "../../store/constants";
import styles from "../../components/Profile/ProfileLayout.module.css";

const ProfileEdit = () => {
  const { t } = useTranslation(["tabProfile", "validation", "errors", "server"]);
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();

  const isTeacher = user?.role === "teacher";
  const isStudent = user?.role === "student";

  const [formData, setFormData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    albumNumber: isStudent ? user?.album_number || "" : "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    albumNumber: "",
    form: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = t("validation:firstName.required");
      isValid = false;
    } else if (formData.firstName.trim().length < VALIDATION_RULES.NAME_MIN_LENGTH) {
      newErrors.firstName = t("validation:firstName.tooShort");
      isValid = false;
    } else if (!/^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+$/.test(formData.firstName.trim())) {
      newErrors.firstName = t("validation:firstName.invalidChars");
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t("validation:lastName.required");
      isValid = false;
    } else if (formData.lastName.trim().length < VALIDATION_RULES.NAME_MIN_LENGTH) {
      newErrors.lastName = t("validation:lastName.tooShort");
      isValid = false;
    } else if (!/^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+$/.test(formData.lastName.trim())) {
      newErrors.lastName = t("validation:lastName.invalidChars");
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = t("validation:email.required");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = t("validation:email.invalid");
      isValid = false;
    }

    if (isStudent) {
      if (!formData.albumNumber.trim()) {
        newErrors.albumNumber = t("validation:albumNumber.required");
        isValid = false;
      } else if (!/^\d{6}$/.test(formData.albumNumber.trim())) {
        newErrors.albumNumber = t("validation:albumNumber.invalid");
        isValid = false;
      }
    }

    setErrors({ ...errors, ...newErrors });
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        ...(isStudent && { albumNumber: formData.albumNumber.trim() }),
      };

      const result = await updateProfile(payload);
      if (result?.success) {
        navigate("/profile");
      } else {
        setErrors((prev) => ({
          ...prev,
          form: result?.error || t(ERROR_MESSAGES.PROFILE_UPDATE_FAILED),
        }));
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setErrors((prev) => ({
        ...prev,
        form: t(ERROR_MESSAGES.SERVER_ERROR),
      }));
    }
  };

  return (
    <ProfileLayout title={t(user?.role)}>
      {errors.form && (
        <div className={styles.errorMessage}>
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <ProfileSection>
          <Input
            label={t("email")}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
        </ProfileSection>

        <ProfileSection>
          <div className={styles.inputRow}>
            <Input
              label={t("firstName")}
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              required
            />
            <Input
              label={t("lastName")}
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              required
            />
          </div>
        </ProfileSection>

        {isStudent && (
          <ProfileSection className={styles.albumNumberSection}>
            <div className={styles.inputRow}>
              <div className={styles.albumNumberInput}>
                <Input
                  label={t("albumNumber")}
                  name="albumNumber"
                  value={formData.albumNumber}
                  onChange={handleChange}
                  error={errors.albumNumber}
                  maxLength={6}
                  required
                />
              </div>
            </div>
          </ProfileSection>
        )}

        <ProfileActions
          mode="edit"
          onCancel={() => navigate("/profile")}
          onSave={handleSubmit}
        />
      </form>
    </ProfileLayout>
  );
};

export default ProfileEdit;
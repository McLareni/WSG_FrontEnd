// components/Profile/ProfileEdit.jsx

import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProfileLayout from "../../components/Profile/ProfileLayout";
import ProfileSection from "../../components/Profile/ProfileSection";
import Input from "../../components/UI/Input/Input";
import ProfileActions from "../../components/Profile/ProfileActions";
import useAuthStore from "../../store/useAuthStore";
import { validateProfileData } from "./useForm";
import styles from "../../components/Profile/ProfileLayout.module.css";
import 'react-toastify/dist/ReactToastify.css';

const ProfileEdit = () => {
  const { t } = useTranslation([ "validation", "tabProfile"]);
  const navigate = useNavigate();
  const { user, updateProfile, isLoading: isAuthLoading } = useAuthStore();

  const isStudent = user?.role === "student";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    albumNumber: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        albumNumber: isStudent ? user.album_number || "" : "",
      });
    }
  }, [user, isStudent]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback(() => {
    const validationErrors = validateProfileData({
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      album_number: formData.albumNumber,
      isStudent: isStudent, 
    }, t);

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData, t, isStudent]); 

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined })); 
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim(),
        ...(isStudent && { album_number: formData.albumNumber.trim() }),
      };

      const result = await updateProfile(payload);

      if (result?.success) {
        toast.success(t("validation:password.change.updatesuccess"), {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          icon: "✅"
        });
        navigate("/profile");
      } else {
        const errorMessage = t(result?.error || "errors.updateFailed");
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000
        });
      }
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error(t("errors.serverError"), {
        position: "top-right",
        autoClose: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, navigate, t, validateForm, updateProfile, isStudent]);

  if (!user) {
    return null;
  }

  return (
    <ProfileLayout title={t(`tabProfile:${user?.role}`)}>
      <form onSubmit={handleSubmit}>
        <ProfileSection>
          <Input
            label={t("tabProfile:email")}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            disabled={isSubmitting || isAuthLoading}
          />
        </ProfileSection>

        <ProfileSection>
          <div className={styles.inputRow}>
            <Input
              label={t("tabProfile:firstName")}
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              required
              disabled={isSubmitting || isAuthLoading}
            />
            <Input
              label={t("tabProfile:lastName")}
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              required
              disabled={isSubmitting || isAuthLoading}
            />
          </div>
          {isStudent && (
            <Input
              label={t("tabProfile:albumNumber")}
              name="albumNumber"
              value={formData.albumNumber}
              onChange={handleChange}
              error={errors.albumNumber}
              required={isStudent}
              disabled={isSubmitting || isAuthLoading}
            />
          )}
        </ProfileSection>

        <ProfileActions
          mode="edit"
          onCancel={() => navigate("/profile")}
          onSave={handleSubmit}
          isSaveLoading={isSubmitting || isAuthLoading}
          cancelDisabled={isSubmitting || isAuthLoading}
        />
      </form>
    </ProfileLayout>
  );
};

export default ProfileEdit;
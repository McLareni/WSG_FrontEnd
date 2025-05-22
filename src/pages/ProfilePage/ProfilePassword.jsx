import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ProfileLayout from '../../components/Profile/ProfileLayout';
import ProfileSection from '../../components/Profile/ProfileSection';
import Input from '../../components/UI/Input/Input';
import ProfileActions from '../../components/Profile/ProfileActions';
import useAuthStore from "../../store/useAuthStore";

const ProfilePassword = () => {
  const { t } = useTranslation(["tabProfile", "validation"]);
  const navigate = useNavigate();
  const { user, updatePassword } = useAuthStore(); // Додано деструктуризацію user
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ confirmPassword: t("validation:errors.passwordsNotMatch") });
      return;
    }

    try {
      await updatePassword(formData.currentPassword, formData.newPassword);
      navigate('/profile');
    } catch (error) {
      setErrors({ form: error.message });
    }
  };

  if (!user) return <div className="error">{t("errors.userNotFound")}</div>; // Додана перевірка на user

  return (
    <ProfileLayout title={t(user.role)}> {/* Використовуємо user зі стора */}
      {errors.form && <div className="error-message">{errors.form}</div>}
      
      <form onSubmit={handleSave}>
        <ProfileSection>
          <Input
            label={t("currentPassword")}
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
          <Input
            label={t("newPassword")}
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          <Input
            label={t("confirmPassword")}
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />
        </ProfileSection>

        <ProfileActions
          mode="edit"
          onCancel={() => navigate('/profile')}
          onSave={handleSave}
        />
      </form>
    </ProfileLayout>
  );
};

export default ProfilePassword;
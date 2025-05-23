import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ProfileLayout from '../../components/Profile/ProfileLayout';
import ProfileSection from '../../components/Profile/ProfileSection';
import Input from '../../components/UI/Input/Input';
import ProfileActions from '../../components/Profile/ProfileActions';
import useAuthStore from "../../store/useAuthStore";

const ProfilePassword = () => {
  const { t } = useTranslation(["tabProfile"]);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Тимчасовий обробник - просто закриває форму
    navigate('/profile');
  };

  if (!user) return <div>{t("userNotFound")}</div>;

  return (
    <ProfileLayout title={t(user.role)}>
      <form onSubmit={handleSave}>
        <ProfileSection>
          <Input
            label={t("currentPassword")}
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
          />
          <Input
            label={t("newPassword")}
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
          />
          <Input
            label={t("confirmPassword")}
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
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
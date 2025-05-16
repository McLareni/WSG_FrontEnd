import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ProfileLayout from '../../Profile/ProfileLayout';
import ProfileSection from '../../Profile/ProfileSection';
import Input from '../../UI/Input/Input';
import ProfileActions from '../../Profile/ProfileActions';
import useAuthStore from "../../../store/useAuthStore";

const StudentProfilePassword = () => {
  const { t } = useTranslation('tabProfile');
  const navigate = useNavigate();
  const { updatePassword } = useAuthStore();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError(t("errors.passwordsNotMatch"));
      return;
    }

    if (formData.newPassword.length < 8) {
      setError(t("errors.passwordTooShort"));
      return;
    }

    const result = await updatePassword(
      formData.currentPassword, 
      formData.newPassword
    );
    
    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.error || t("errors.passwordChangeFailed"));
    }
  };

  return (
    <ProfileLayout title={t('student')}>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSave}>
        <ProfileSection>
          <div className="inputGroup">
            <Input
              label={t('currentPassword')}
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="inputGroup">
            <Input
              label={t('newPassword')}
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="inputGroup">
            <Input
              label={t('confirmPassword')}
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </ProfileSection>

        <ProfileActions
          mode="password"
          onCancel={() => navigate('/profile')}
          onSave={handleSave}
        />
      </form>
    </ProfileLayout>
  );
};

export default StudentProfilePassword;
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ProfileLayout from '../../Profile/ProfileLayout';
import ProfileSection from '../../Profile/ProfileSection';
import Input from '../../UI/Input/Input';
import ProfileActions from '../../Profile/ProfileActions';
import useAuthStore from "../../../store/useAuthStore";
import { ERROR_MESSAGES, VALIDATION_RULES } from '../../../store/constants';

const TeacherProfilePassword = () => {
  const { t } = useTranslation(["tabProfile", "validation"]);
  const navigate = useNavigate();
  const { updatePassword } = useAuthStore();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    form: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      form: ''
    };
    let isValid = true;

    if (!formData.currentPassword) {
      newErrors.currentPassword = t(ERROR_MESSAGES.REQUIRED_FIELDS);
      isValid = false;
    }

    if (!formData.newPassword) {
      newErrors.newPassword = t(ERROR_MESSAGES.REQUIRED_FIELDS);
      isValid = false;
    } else if (formData.newPassword.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
      newErrors.newPassword = t(ERROR_MESSAGES.PASSWORD_TOO_SHORT);
      isValid = false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t(ERROR_MESSAGES.PASSWORDS_NOT_MATCH);
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await updatePassword(formData);
      
      if (result?.success) {
        navigate('/profile');
      } else {
        setErrors(prev => ({
          ...prev,
          form: result?.error || t(ERROR_MESSAGES.PASSWORD_CHANGE_FAILED)
        }));
      }
    } catch (err) {
      console.error('Password change error:', err);
      setErrors(prev => ({
        ...prev,
        form: t(ERROR_MESSAGES.SERVER_ERROR)
      }));
    }
  };

  return (
    <ProfileLayout title={t("teacher")}>
      {errors.form && (
        <div className="error-message">
          {errors.form}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <ProfileSection>
          <Input
            label={t("currentPassword")}
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            error={errors.currentPassword}
            required
          />
        </ProfileSection>

        <ProfileSection>
          <Input
            label={t("newPassword")}
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            required
          />
        </ProfileSection>

        <ProfileSection>
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
          onSave={handleSubmit}
        />
      </form>
    </ProfileLayout>
  );
};

export default TeacherProfilePassword;
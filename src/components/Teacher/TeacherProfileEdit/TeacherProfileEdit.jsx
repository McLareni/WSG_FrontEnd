import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ProfileLayout from '../../Profile/ProfileLayout';
import ProfileSection from '../../Profile/ProfileSection';
import Input from '../../UI/Input/Input';
import ProfileActions from '../../Profile/ProfileActions';
import useAuthStore from "../../../store/useAuthStore";
import { ERROR_MESSAGES, VALIDATION_RULES } from '../../../store/constants';

const TeacherProfileEdit = () => {
  const { t } = useTranslation(["tabProfile", "validation"]);
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();
  
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || ''
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    form: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      form: ''
    };
    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = t(ERROR_MESSAGES.REQUIRED_FIELDS);
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t(ERROR_MESSAGES.REQUIRED_FIELDS);
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = t(ERROR_MESSAGES.REQUIRED_FIELDS);
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = t("validation.email.invalid");
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
      const result = await updateProfile(formData);
      
      if (result?.success) {
        navigate('/profile');
      } else {
        setErrors(prev => ({
          ...prev,
          form: result?.error || t(ERROR_MESSAGES.PROFILE_UPDATE_FAILED)
        }));
      }
    } catch (err) {
      console.error('Profile update error:', err);
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
          <div className="inputGroup">
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

        <div className="divider"></div>

        <ProfileSection title={t("createdRooms")}>
          <ul className="roomsList">
            {user?.rooms?.map(room => (
              <li key={room.id} className="roomItem">
                <span>{room.name}</span>
                <span className={room.active ? "activeStatus" : "inactiveStatus"}>
                  {t(room.active ? "active" : "inactive")}
                </span>
              </li>
            ))}
          </ul>
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

export default TeacherProfileEdit;
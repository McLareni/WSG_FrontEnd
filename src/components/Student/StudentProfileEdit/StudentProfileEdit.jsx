import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ProfileLayout from '../../Profile/ProfileLayout';
import ProfileSection from '../../Profile/ProfileSection';
import Input from '../../UI/Input/Input';
import ProfileActions from '../../Profile/ProfileActions';
import useAuthStore from "../../../store/useAuthStore";

const StudentProfileEdit = () => {
  const { t } = useTranslation(["tabProfile", "validation"]);
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();
  
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    albumNumber: user?.album_number || ''
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    albumNumber: ''
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
      albumNumber: ''
    };
    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = t("validation:firstName.required");
      isValid = false;
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = t("validation:firstName.tooShort");
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t("validation:lastName.required");
      isValid = false;
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = t("validation:lastName.tooShort");
      isValid = false;
    }

    if (!formData.albumNumber.trim()) {
      newErrors.albumNumber = t("validation:albumNumber.required");
      isValid = false;
    } else if (!/^\d{6}$/.test(formData.albumNumber.trim())) {
      newErrors.albumNumber = t("validation:albumNumber.invalid");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await updateProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        albumNumber: formData.albumNumber.trim()
      });
      
      if (result?.success) {
        navigate('/profile');
      } else {
        setErrors(prev => ({
          ...prev,
          formError: result?.error || t("validation:errors.serverError")
        }));
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setErrors(prev => ({
        ...prev,
        formError: t("validation:errors.serverError")
      }));
    }
  };

  return (
    <ProfileLayout title={t("student")}>
      {errors.formError && (
        <div className="error-message" style={{ 
          color: 'red', 
          margin: '10px 0',
          padding: '10px',
          backgroundColor: '#ffeeee',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          {errors.formError}
        </div>
      )}
      
      <form onSubmit={handleSave}>
        <ProfileSection>
          <Input
            label={t("tabProfile:firstName")}
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            error={errors.firstName}
          />
        </ProfileSection>

        <ProfileSection>
          <Input
            label={t("tabProfile:lastName")}
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            error={errors.lastName}
          />
        </ProfileSection>

        <ProfileSection>
          <Input
            label={t("tabProfile:albumNumber")}
            name="albumNumber"
            value={formData.albumNumber}
            onChange={handleChange}
            required
            error={errors.albumNumber}
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

export default StudentProfileEdit;
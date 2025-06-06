import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProfileLayout from '../../components/Profile/ProfileLayout';
import ProfileSection from '../../components/Profile/ProfileSection';
import Input from '../../components/UI/Input/Input';
import ProfileActions from '../../components/Profile/ProfileActions';
import useAuthStore from "../../store/useAuthStore";
import { usePasswordValidation, usePasswordSubmit } from './useForm';

const ProfilePassword = () => {
  const { t } = useTranslation(["tabProfile", "validation", "errors"]);
  const navigate = useNavigate();
  const { user, changePassword, error, clearErrors, isLoading: isAuthLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const timeoutRef = useRef(null);

  const validateForm = usePasswordValidation(formData, t);
  const handleSubmitForm = usePasswordSubmit({
    formData,
    validateForm,
    changePassword,
    t,
    setErrors,
    navigate
  });

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (submitAttempted || Object.keys(touched).length > 0) {
        setErrors(validateForm());
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formData, touched, validateForm, submitAttempted]);

  useEffect(() => {
    if (error) {
      setErrors(prev => ({
        ...prev,
        currentPassword: error.includes('current') ? t(error) : undefined
      }));
      
      if (error.includes('network')) {
        toast.error(t(error), { 
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      }
    }
  }, [error, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    clearErrors();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setSubmitAttempted(true);
    setTouched({
      currentPassword: true,
      newPassword: true,
      confirmPassword: true
    });

    // Швидка валідація перед відправкою
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (formData.newPassword === formData.currentPassword) {
      setErrors({
        newPassword: t('validation:password.change.sameAsOld')
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await handleSubmitForm();
      
      if (result) {
        toast.success(t("validation:password.change.success"), {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          icon: "🔐"
        });
      }
    } catch (error) {
      console.error('Password change error:', error);
      if (!error.message.includes('Validation failed')) {
        toast.error(t('errors.serverError'), {
          position: "top-right",
          autoClose: 5000
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <ProfileLayout title={t(user.role)}>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <ProfileSection>
          {error && !errors.currentPassword && !error.includes('network') && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {t(error)}
            </div>
          )}
          
          <Input
            label={t("tabProfile:currentPassword")}
            name="currentPassword"
            type={showPasswords.current ? "text" : "password"}
            value={formData.currentPassword}
            onChange={handleChange}
            error={errors.currentPassword}
            disabled={isSubmitting || isAuthLoading}
            required
            autoComplete="current-password"
            appendIcon={
              <button 
                type="button" 
                onClick={() => setShowPasswords(prev => ({...prev, current: !prev.current}))}
                className="text-gray-500 hover:text-gray-700"
                aria-label={showPasswords.current ? t("common:hidePassword") : t("common:showPassword")}
              >
                
              </button>
            }
          />
          
          <Input
            label={t("tabProfile:newPassword")}
            name="newPassword"
            type={showPasswords.new ? "text" : "password"}
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            disabled={isSubmitting || isAuthLoading}
            required
            autoComplete="new-password"
            appendIcon={
              <button 
                type="button" 
                onClick={() => setShowPasswords(prev => ({...prev, new: !prev.new}))}
                className="text-gray-500 hover:text-gray-700"
                aria-label={showPasswords.new ? t("common:hidePassword") : t("common:showPassword")}
              >
                
              </button>
            }
          />
          
          <Input
            label={t("tabProfile:confirmPassword")}
            name="confirmPassword"
            type={showPasswords.confirm ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            disabled={isSubmitting || isAuthLoading}
            required
            autoComplete="new-password"
            appendIcon={
              <button 
                type="button" 
                onClick={() => setShowPasswords(prev => ({...prev, confirm: !prev.confirm}))}
                className="text-gray-500 hover:text-gray-700"
                aria-label={showPasswords.confirm ? t("common:hidePassword") : t("common:showPassword")}
              >
            
              </button>
            }
          />
        </ProfileSection>

        <ProfileActions
          mode="edit"
          onCancel={() => navigate('/profile')}
          isSaveLoading={isSubmitting || isAuthLoading}
          cancelDisabled={isSubmitting || isAuthLoading}
        />
      </form>
    </ProfileLayout>
  );
};

export default ProfilePassword;
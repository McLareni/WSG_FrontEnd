// ProfileActions.js
import { useTranslation } from 'react-i18next';
import Button from '../UI/Button/Button';
import styles from './ProfileLayout.module.css';

const ProfileActions = ({ 
  mode = 'view',
  onEdit,
  onChangePassword,
  onCancel,
  onSave,
  isSubmitting = false,
  editDisabled = false,
  changePasswordDisabled = false
}) => {
  const { t } = useTranslation("tabProfile");
  
  return (
    <div className={styles.actionsContainer}>
      {mode === 'view' ? (
        <>
          <Button 
            variant="edit"
            onClick={onEdit}
            disabled={editDisabled}
            aria-label={t("edit")}
          >
            {t("edit")}
          </Button>
          <Button
            variant="changePassword"
            onClick={onChangePassword}
            disabled={changePasswordDisabled}
            aria-label={t("changePassword")}
          >
            {t("changePassword")}
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {t('buttons.cancel')}
          </Button>
          <Button
            variant="saveChanges"
            onClick={onSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('buttons.saving') : t('buttons.saveChanges')}
          </Button>
        </>
      )}
    </div>
  );
};

export default ProfileActions;
import { useTranslation } from 'react-i18next';
import Button from '../UI/Button/Button';

const ProfileActions = ({ 
  mode = 'view', // 'view' | 'edit' | 'password'
  onEdit,
  onChangePassword,
  onCancel,
  onSave
}) => {
  const { t } = useTranslation("tabProfile");
  
  if (mode === 'view') {
    return (
      <div className="actions">
        <Button 
          variant="edit"
          onClick={onEdit}
        >
          {t("edit")}
        </Button>
        <Button
          variant="changePassword"
          onClick={onChangePassword}
        >
          {t("changePassword")}
        </Button>
      </div>
    );
  }

  return (
    <div className="actions">
      <Button
        variant="cancel"
        onClick={onCancel}
      >
        {t('buttons.cancel')}
      </Button>
      <Button
        variant="saveChanges"
        onClick={onSave}
      >
        {t('buttons.saveChanges')}
      </Button>
    </div>
  );
};

export default ProfileActions;
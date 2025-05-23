import { useTranslation } from 'react-i18next';
import './Loader.module.css';

export const Loader = () => {
  const { t } = useTranslation();
  return (
    <div className="loader">
      <div className="spinner"></div>
      <p>{t('common.pleaseWait')}</p>
    </div>
  );
};
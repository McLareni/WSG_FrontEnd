import { useTranslation } from 'react-i18next';
import styles from './Loader.module.css';

export const Loader = ({ isLoading }) => {
  const { t } = useTranslation();
  
  return (
    <div className={`${styles.fullscreenLoader} ${!isLoading ? styles.fadeOut : ''}`}>
      <div className={styles.loaderContent}>
        <div className={`${styles.spinner} ${styles.large} ${styles.primary}`}>
          <div className={styles.spinnerInner}></div>
          <div className={styles.spinnerTrack}></div>
        </div>
        <p className={styles.loaderText}>{t('common.pleaseWait')}</p>
        <div className={styles.progressBar}>
          <div className={`${styles.progressFill} ${!isLoading ? styles.complete : ''}`}></div>
        </div>
      </div>
    </div>
  );
};
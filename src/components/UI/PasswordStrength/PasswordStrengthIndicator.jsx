import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PasswordStrengthIndicator.module.css';

const PasswordStrengthIndicator = ({ password }) => {
  const { t } = useTranslation('adminUser');
  
  const getStrength = (pass) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length > 7) strength++;
    if (pass.match(/[a-z]/)) strength++;
    if (pass.match(/[A-Z]/)) strength++;
    if (pass.match(/[0-9]/)) strength++;
    if (pass.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const strength = getStrength(password);
  const strengthTexts = [
    t('passwordStrength.veryWeak'),
    t('passwordStrength.weak'),
    t('passwordStrength.medium'),
    t('passwordStrength.strong'),
    t('passwordStrength.veryStrong')
  ];
  const strengthText = strengthTexts[strength];

  return (
    <div className={styles.strengthIndicator}>
      <div className={styles.bars}>
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`${styles.bar} ${i <= strength ? styles[`strength${strength}`] : ''}`}
          />
        ))}
      </div>
      <span className={styles.strengthText}>
        {password && (
          <>
            {t('passwordStrength.strength')}: {strengthText}
          </>
        )}
      </span>
    </div>
  );
};

export default PasswordStrengthIndicator;
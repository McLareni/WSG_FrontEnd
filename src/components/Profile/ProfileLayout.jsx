import styles from './ProfileLayout.module.css';

const ProfileLayout = ({ title, children, actions }) => {
  return (
    <div className={styles.profileWrapper}>
      <div className={styles.profileContainer}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}></div>
        </div>
        
        <h1 className={styles.title}>{title}</h1>
        
        <div className={styles.content}>
          {children}
        </div>
        
        {actions && <div className={styles.actionsContainer}>{actions}</div>}
      </div>
    </div>
  );
};

export default ProfileLayout;
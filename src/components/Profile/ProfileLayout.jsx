import styles from './ProfileLayout.module.css';

const ProfileLayout = ({ title, children }) => {
  return (
    <div className={styles.profileWrapper}>
      <div className={styles.profileContainer}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}></div>
        </div>
        
        <h1 className={styles.title}>{title}</h1>
        
        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;
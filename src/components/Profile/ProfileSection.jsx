import styles from './ProfileLayout.module.css';

const ProfileSection = ({ title, children }) => {
  return (
    <section className={styles.section}>
      {title && <h2 className={styles.sectionTitle}>{title}</h2>}
      {children}
    </section>
  );
};

export default ProfileSection;
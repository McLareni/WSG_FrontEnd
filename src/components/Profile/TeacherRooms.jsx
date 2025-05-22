import { useTranslation } from "react-i18next";
import styles from './ProfileLayout.module.css';

const TeacherRooms = ({ rooms }) => {
  const { t } = useTranslation("tabProfile");

  return (
    <>
      <div className={styles.divider}></div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{t("createdRooms")}</h2>
        <div className={styles.roomsListWrapper}>
          <ul className={styles.roomsList}>
            {rooms?.map((room, index) => (
              <li
                key={room.id}
                className={styles.roomItem}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span>{room.name}</span>
                <span
                  className={`${room.active ? styles.activeStatus : styles.inactiveStatus} ${styles.statusTransition}`}
                >
                  {t(room.active ? "active" : "inactive")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default TeacherRooms;

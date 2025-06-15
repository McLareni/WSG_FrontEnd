import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useAuthStore from "../../store/useAuthStore";
import styles from "./ProfileLayout.module.css";

const TeacherRooms = ({ rooms, loading, error }) => {
  const { t } = useTranslation("tabProfile");
 if (loading) return <div className={styles.loading}>{t("loading")}...</div>;
  
  if (error) {
    console.error('Rooms error:', error);
    return (
      <div className={styles.error}>
        {t("errors.fetchFailed")}: {error.message || error}
      </div>
    );
  }

  return (
    <>
      <div className={styles.divider}></div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{t("createdRooms")}</h2>
        {!rooms || rooms.length === 0 ? (
          <p>{t("noRooms")}</p>
        ) : (
          <div className={styles.roomsListWrapper}>
            <ul className={styles.roomsList}>
              {rooms.map((room, index) => (
                <li
                  key={room.id}
                  className={styles.roomItem}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span>{room.name}</span>
                  <span
                    className={`${room.is_active ? styles.activeStatus : styles.inactiveStatus} ${styles.statusTransition}`}
                  >
                    {t(room.is_active ? "active" : "inactive")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default TeacherRooms;
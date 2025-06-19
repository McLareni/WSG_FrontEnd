// RoomCard.js
import React from "react";
import styles from "./RoomCard.module.css";

const RoomCard = ({
  name,
  imageSrc,
  category,
  schedule,
  onReserve = () => {},
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.front}>
        <img src={imageSrc} alt={name} className={styles.image} />
        <div className={styles.footer}></div>
        <span className={styles.categoryBadge}>{category}</span>
      </div>

      <div className={styles.dropdown}>
        <h3 className={styles.dropdownTitle}>{name}</h3>
        <div className={styles.scheduleContainer}>
          <h4 className={styles.scheduleTitle}>Harmonogram</h4>
          <ul className={styles.scheduleList}>
            {Object.entries(schedule).map(([day, hours]) => (
              <li key={day} className={styles.scheduleItem}>
                <span className={styles.scheduleDay}>{day}:</span>
                <span className={styles.scheduleHours}>
                  {isNaN(hours[0]) ? <strong>Dzień wolny</strong> : hours}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <button
          className={styles.reserveBtn}
          onClick={(e) => {
            e.stopPropagation();
            onReserve(name);
          }}
        >
          Zarezerwuj
        </button>
      </div>
    </div>
  );
};

export default RoomCard;

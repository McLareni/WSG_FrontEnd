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
      {/* Основна частина картки */}
      <div className={styles.front}>
        <img src={imageSrc} alt={name} className={styles.image} />
        <div className={styles.footer}>
          <h3 className={styles.title}>{name}</h3>
        </div>
        <span className={styles.categoryBadge}>{category}</span>
      </div>

      {/* Дропдаун меню, яке з'являється при наведенні */}
      <div className={styles.dropdown}>
        <div className={styles.schedule}>
          <h4>Harmonogram</h4>
          {Object.entries(schedule).map(([day, hours]) => (
            <div key={day} className={styles.dayRow}>
              <span className={styles.day}>{day}:</span>
              <span className={styles.hours}>{hours}</span>
            </div>
          ))}
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

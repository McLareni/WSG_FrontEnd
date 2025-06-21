import { useTranslation } from "react-i18next";
import styles from "./RoomCard.module.css";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const RoomCard = ({
  name,
  imageSrc,
  category,
  schedule,
  onReserve = () => {},
}) => {
  const { t } = useTranslation("homePage");

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
            {DAYS.map((day, i) => {
              return (
                <li key={day} className={styles.scheduleItem}>
                  <span className={styles.scheduleDay}>
                    {t(`days.${day}`)}:
                  </span>
                  <span className={styles.scheduleHours}>
                    {DAYS.includes(schedule[i]?.day_of_week)
                      ? `${schedule[i].open_time.slice(0, 5)} - 
                  ${schedule[i].close_time.slice(0, 5)}`
                      : t(`days.dayOff`)}
                  </span>
                </li>
              );
            })}
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

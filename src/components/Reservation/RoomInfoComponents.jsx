import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./RoomInfoComponents.module.css";
import PropTypes from "prop-types";

// Location Component
const Location = ({ address }) => {
  const { t } = useTranslation(["reservationRoom"]);

  return (
    <div className={styles.locationBox}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t("location.title")}</h2>
        <div className={styles.divider}></div>
      </div>
      <div className={styles.scrollContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.locationInfo}>
            <svg
              className={styles.locationIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 12.5C13.1046 12.5 14 11.6046 14 10.5C14 9.39543 13.1046 8.5 12 8.5C10.8954 8.5 10 9.39543 10 10.5C10 11.6046 10.8954 12.5 12 12.5Z"
                fill="#4A5568"
              />
              <path
                d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 13.5C10.8954 13.5 10 12.6046 10 11.5C10 10.3954 10.8954 9.5 12 9.5C13.1046 9.5 14 10.3954 14 11.5C14 12.6046 13.1046 13.5 12 13.5Z"
                fill="#4A5568"
              />
            </svg>
            <span>
              {address || t("location.address", { number: "Garbary2" })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

Location.propTypes = {
  address: PropTypes.string,
};

// RoomDescription.js
const RoomDescription = ({ room }) => {
  const { t } = useTranslation(["reservationRoom"]);

  return (
    <div className={styles.descriptionBox}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t("roomDescription.title")}</h2>
        <div className={styles.divider}></div>
      </div>
      <div className={styles.scrollContent}>
        <div className={styles.contentWrapper}>
          <p className={styles.descriptionText}>
            {room?.description || t("roomDescription.defaultDescription")}
          </p>
        </div>
      </div>
    </div>
  );
};

RoomDescription.propTypes = {
  room: PropTypes.shape({
    description: PropTypes.string,
  }),
};

// InfoTable.js
const InfoTable = ({ seats = [] }) => {
  const { t } = useTranslation(["reservationRoom"]);

  if (!seats || seats.length === 0) {
    return (
      <div className={styles.tableSection}>
        <p>{t("infoTable.noSeatsAvailable")}</p>
      </div>
    );
  }

  return (
    <div className={styles.tableSection}>
      <div className={styles.tableContainer}>
        <table
          className={styles.infoTable}
          aria-label={t("infoTable.description")}
        >
          <thead>
            <tr>
              <th scope="col" className={styles.nrColumn}>
                {t("infoTable.number")}
              </th>
              <th scope="col" className={styles.descColumn}>
                {t("infoTable.placeDescription")}
              </th>
            </tr>
          </thead>
          <tbody>
            {seats.map((seat) => (
              <tr key={seat.id}>
                <td className={styles.nrColumn}>{seat.seat_number}</td>
                <td className={styles.descColumn}>
                  {seat.description ? (
                    seat.description.split("; ").map((part, i) => (
                      <div key={i} className={styles.descPart}>
                        {part}
                      </div>
                    ))
                  ) : (
                    <div className={styles.descPart}>
                      {t("infoTable.noDescription")}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

InfoTable.propTypes = {
  seats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      seat_number: PropTypes.number.isRequired,
      description: PropTypes.string,
    })
  ),
};

export { InfoTable, Location, RoomDescription };

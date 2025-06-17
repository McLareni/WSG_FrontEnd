import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import styles from "./RoomInfoComponents.module.css";
import { FaMapMarkerAlt } from "react-icons/fa";

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
            <FaMapMarkerAlt className={styles.locationIcon} />
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

const InfoTable = ({ 
  seats = [], 
  onSeatSelect, 
  reservedSeats = [], 
  selectedSeats = [], 
  isLoading = false 
}) => {
  const { t } = useTranslation(["reservationRoom"]);
  const [currentSelectedSeat, setCurrentSelectedSeat] = useState(
    selectedSeats.length > 0 ? selectedSeats[0] : null
  );

  useEffect(() => {
    setCurrentSelectedSeat(selectedSeats.length > 0 ? selectedSeats[0] : null);
  }, [selectedSeats]);

  const handleSeatClick = (seatNumber) => {
    if (reservedSeats.includes(seatNumber)) return;
    const newSelectedSeat = currentSelectedSeat === seatNumber ? null : seatNumber;
    setCurrentSelectedSeat(newSelectedSeat);
    
    const seatObj = seats.find(s => s.seat_number === newSelectedSeat);
    onSeatSelect(seatObj);
  };

  if (isLoading) {
    return <LoadingState t={t} />;
  }

  if (!seats || seats.length === 0) {
    return <NoSeatsState t={t} />;
  }

  return (
    <div className={styles.tableSection}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t("placeSelection.selectPlace")}</h3>
        <div className={styles.divider}></div>
      </div>
      
      <div className={styles.tableContainer}>
        <table className={styles.infoTable}>
          <colgroup>
            <col style={{ width: '10%' }} />
            <col style={{ width: '65%' }} />
            <col style={{ width: '25%' }} />
          </colgroup>
          <thead>
            <tr>
              <th className={styles.tableHeader}>№</th>
              <th className={styles.tableHeader}>{t("placeSelection.seat")}</th>
              <th className={styles.tableHeader}>{t("placeSelection.status.status")}</th>
            </tr>
          </thead>
          <tbody>
            {seats.map((seat) => {
              const isSelected = currentSelectedSeat === seat.seat_number;
              const isReserved = reservedSeats.includes(seat.seat_number);
              
              return (
                <TableRow
                  key={seat.id}
                  seat={seat}
                  isSelected={isSelected}
                  isReserved={isReserved}
                  onSeatClick={handleSeatClick}
                  t={t}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LoadingState = ({ t }) => (
  <div className={styles.tableSection}>
    <div className={styles.header}>
      <h3 className={styles.title}>{t("placeSelection.selectPlace")}</h3>
      <div className={styles.divider}></div>
    </div>
    <div className={styles.loading}>{t("placeSelection.status.loading")}</div>
  </div>
);

const NoSeatsState = ({ t }) => (
  <div className={styles.tableSection}>
    <div className={styles.header}>
      <h3 className={styles.title}>{t("placeSelection.selectPlace")}</h3>
      <div className={styles.divider}></div>
    </div>
    <div className={styles.noSeats}>{t("placeSelection.noSeatsAvailable")}</div>
  </div>
);

const TableRow = ({ seat, isSelected, isReserved, onSeatClick, t }) => {
  const status = isReserved ? 'occupied' : isSelected ? 'selected' : 'available';
  const statusText = isReserved ? t("placeSelection.status.occupied") : 
                    isSelected ? t("placeSelection.status.selected") : 
                    t("placeSelection.status.available");

  return (
    <tr
      className={`
        ${styles.tableRow}
        ${isSelected ? styles.selectedRow : ''}
        ${isReserved ? styles.reservedRow : ''}
      `}
      onClick={() => !isReserved && onSeatClick(seat.seat_number)}
      aria-disabled={isReserved}
    >
      <td className={styles.tableCell}>{seat.seat_number}</td>
      <td className={styles.tableCell}>
        {seat.description ? (
          seat.description.split("; ").map((part, i) => (
            <div key={i} className={styles.descPart}>{part}</div>
          ))
        ) : (
          <div className={styles.descPart}>{t("placeSelection.seat")} {seat.seat_number}</div>
        )}
      </td>
      <td className={styles.tableCell}>
        <div className={styles.statusContainer}>
          <div className={`${styles.statusIndicator} ${styles[status]}`} />
          <span className={styles.statusText}>{statusText}</span>
        </div>
      </td>
    </tr>
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
  onSeatSelect: PropTypes.func.isRequired,
  reservedSeats: PropTypes.arrayOf(PropTypes.number),
  selectedSeats: PropTypes.arrayOf(PropTypes.number),
  isLoading: PropTypes.bool,
};

export { InfoTable, Location, RoomDescription };
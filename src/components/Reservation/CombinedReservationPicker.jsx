import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-modern-calendar-datepicker';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types';
import styles from './CombinedReservationPicker.module.css';
import { fetchOpenHours } from "../../store/api";

// CalendarPicker Component (без змін)
const CalendarPicker = ({ value, onChange }) => {
  const { t } = useTranslation(["reservationRoom"]);

  const defaultValue = value
    ? {
        year: value.getFullYear(),
        month: value.getMonth() + 1,
        day: value.getDate(),
      }
    : null;

  const today = new Date();
  const minimumDate = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  };

  return (
    <div className={styles.calendarWrapper} aria-labelledby="calendar-title">
      <div className={styles.header}>
        <h3 id="calendar-title" className={styles.title}>
          {t("calendar.selectDate")}
        </h3>
        <div className={styles.divider} aria-hidden="true"></div>
      </div>
      <Calendar
        value={defaultValue}
        onChange={(d) => onChange(new Date(d.year, d.month - 1, d.day))}
        minimumDate={minimumDate}
        calendarClassName={styles.customCalendar}
        shouldHighlightWeekends
        colorPrimary="#1EADFF"
        colorPrimaryLight="#EBF8FF"
      />
    </div>
  );
};

CalendarPicker.propTypes = {
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
};

// PlaceSelection Component
const PlaceSelection = ({
  onSeatSelect,
  reservedSeats = [],
  isLoading = false,
  selectedSeats: propSelectedSeats = [],
  availableSeats = []
}) => {
  const { t } = useTranslation(["reservationRoom"]);
  const [selectedSeats, setSelectedSeats] = useState(propSelectedSeats);

  useEffect(() => {
    setSelectedSeats(propSelectedSeats);
  }, [propSelectedSeats]);

  const handleSeatClick = (seatNumber) => {

    if (reservedSeats.includes(seatNumber)) return;

    const updated = selectedSeats.includes(seatNumber)
      ? selectedSeats.filter(num => num !== seatNumber)
      : [...selectedSeats, seatNumber];

    setSelectedSeats(updated);
    onSeatSelect(updated);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>{t("placeSelection.selectPlace")}</h3>
          <div className={styles.divider}></div>
        </div>
        <div className={styles.loading}>
          {t("placeSelection.loading")}
        </div>
      </div>
    );
  }

  if (!availableSeats || availableSeats.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>{t("placeSelection.selectPlace")}</h3>
          <div className={styles.divider}></div>
        </div>
        <div className={styles.noSeats}>
          {t("placeSelection.noSeatsAvailable")}
        </div>
      </div>
    );
  }

  // Оптимізація створення рядів:
  const seatsPerRow = 5;
  const rows = [];
  for (let i = 0; i < availableSeats.length; i += seatsPerRow) {
    rows.push(
      <div key={`row-${Math.floor(i / seatsPerRow)}`} className={styles.row}>
        {availableSeats.slice(i, i + seatsPerRow).map((seat) => {
          const seatNumber = seat.seat_number;
          const isSelected = selectedSeats.includes(seatNumber);
          const isReserved = reservedSeats.includes(seatNumber);

          return (
            <button
              key={`seat-${seat.id}`}
              className={`
                ${styles.seat}
                ${isSelected ? styles.selected : ''}
                ${isReserved ? styles.reserved : ''}
              `}
              onClick={() => handleSeatClick(seatNumber)}
              disabled={isReserved}
              aria-label={`${t("placeSelection.seat")} ${seatNumber} ${seat.description ? `(${seat.description})` : ''}`}
              aria-pressed={isSelected}
              title={isReserved
                ? t("placeSelection.status.occupied")
                : isSelected
                  ? t("placeSelection.status.selected")
                  : t("placeSelection.status.available")}
            >
              {seatNumber}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t("placeSelection.selectPlace")}</h3>
        <div className={styles.divider}></div>
      </div>

      <div className={styles.classroom}>
        <div className={styles.seatsGrid}>
          {rows} 
        </div>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.available}`}></div>
          <span>{t("placeSelection.status.available")}</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.selected}`}></div>
          <span>{t("placeSelection.status.selected")}</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.occupied}`}></div>
          <span>{t("placeSelection.status.occupied")}</span>
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className={styles.selectionInfo}>
          {t("placeSelection.selected")}: {selectedSeats.sort((a, b) => a - b).join(', ')}
        </div>
      )}
    </div>
  );
};

PlaceSelection.propTypes = {
  onSeatSelect: PropTypes.func.isRequired,
  reservedSeats: PropTypes.arrayOf(PropTypes.number),
  isLoading: PropTypes.bool,
  selectedSeats: PropTypes.arrayOf(PropTypes.number),
  availableSeats: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    seat_number: PropTypes.number.isRequired,
    description: PropTypes.string
  })).isRequired
};

const allTimeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

const TimeSlotPicker = ({
  selectedTime,
  setSelectedTime,
  selectedDate,
  roomId
}) => {
  const { t } = useTranslation(["reservationRoom"]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loadingHours, setLoadingHours] = useState(false);
  const [errorHours, setErrorHours] = useState(null);

  useEffect(() => {
    const getHours = async () => {
      if (!selectedDate || !roomId) {
        setAvailableTimes([]);
        return;
      }

      setLoadingHours(true);
      setErrorHours(null);
      try {
        const openHours = await fetchOpenHours(selectedDate, roomId);
        setAvailableTimes(openHours);
      } catch (err) {
        console.error("Failed to fetch open hours:", err);
        setErrorHours(t("timeSlots.errorLoadingHours"));
        setAvailableTimes([]);
      } finally {
        setLoadingHours(false);
      }
    };

    getHours();
  }, [selectedDate, roomId, t]);

  const isTimeDisabled = (time) => {
    return !availableTimes.includes(time);
  };

  if (!selectedDate) return null;

  return (
    <div className={styles.timeSection}>
      <div className={styles.header}>
        <h3 className={styles.sectionTitle}>{t("timeSlots.availableHours")}</h3>
        <div className={styles.divider}></div>
      </div>
      {loadingHours && (
        <div className={styles.loading}>
          {t("timeSlots.loadingHours")}
        </div>
      )}
      {errorHours && (
        <div className={styles.error}>
          {errorHours}
        </div>
      )}
      {!loadingHours && !errorHours && (
        <div className={styles.tableContainer}>
          <div className={styles.timeGrid}>
            {Array.from({ length: Math.ceil(allTimeSlots.length / 6) }, (_, rowIndex) => (
              <div key={`row-${rowIndex}`} className={styles.timeRow}>
                {allTimeSlots.slice(rowIndex * 6, rowIndex * 6 + 6).map((time) => {
                  const isDisabled = isTimeDisabled(time);
                  return (
                    <button
                      key={time}
                      className={`${styles.timeSlot} ${
                        selectedTime === time ? styles.selected : ''
                      } ${
                        isDisabled ? styles.disabled : ''
                      }`}
                      onClick={() => !isDisabled && setSelectedTime(time)}
                      disabled={isDisabled}
                      aria-label={`${t("timeSlots.timeSlot")} ${time}`}
                      aria-pressed={selectedTime === time}
                      title={isDisabled ? t("timeSlots.status.unavailable") : ''}
                    >
                      {time}
                      {isDisabled && (
                        <span className="visually-hidden">
                          ({t("timeSlots.status.unavailable")})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

TimeSlotPicker.propTypes = {
  selectedTime: PropTypes.string,
  setSelectedTime: PropTypes.func.isRequired,
  selectedDate: PropTypes.instanceOf(Date),
  roomId: PropTypes.string.isRequired,
};

export { CalendarPicker, PlaceSelection, TimeSlotPicker };
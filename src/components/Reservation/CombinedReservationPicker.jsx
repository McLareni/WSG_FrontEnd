import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-modern-calendar-datepicker';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types';
import styles from './CombinedReservationPicker.module.css';
import { fetchOpenHours } from "../../store/api";

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

const allTimeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

const TimeSlotPicker = ({
  selectedTime,
  setSelectedTime,
  selectedDate,
  roomId,
  selectedSeatDescription
}) => {
  const { t } = useTranslation(["reservationRoom"]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loadingHours, setLoadingHours] = useState(false);
  const [errorHours, setErrorHours] = useState(null);

  useEffect(() => {
    const getHours = async () => {
      if (!selectedDate || !roomId || !selectedSeatDescription) {
        setAvailableTimes([]);
        return;
      }

      setLoadingHours(true);
      setErrorHours(null);
      try {
        const openHours = await fetchOpenHours(selectedDate, roomId, selectedSeatDescription);
        setAvailableTimes(openHours);
      } catch (err) {
        console.error("Failed to fetch open hours:", err);
        setErrorHours(t("timeSlots.errorLoadingHours"));
        setAvailableTimes([]);
      } finally {
        setLoadingHours(false);
      }
    };

    const timer = setTimeout(getHours, 800);
    return () => clearTimeout(timer);
  }, [selectedDate, roomId, selectedSeatDescription, t]);

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
  selectedSeatDescription: PropTypes.string.isRequired,
};

export { CalendarPicker, TimeSlotPicker };
import React, { useState, useEffect } from "react";
import { DayPicker } from 'react-day-picker';
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import styles from "./CombinedReservationPicker.module.css";
import 'react-day-picker/dist/style.css';
import { fetchOpenHours } from "../../store/api";

const CalendarPicker = ({ value, onChange, disabledDates, onMonthChange }) => {
  const { t } = useTranslation(["reservationRoom"]);

  // Функції для форматування з перекладами
  const formatWeekdayName = (date) => {
    const weekdays = [
      t("calendar.weekdays.sun"),
      t("calendar.weekdays.mon"),
      t("calendar.weekdays.tue"),
      t("calendar.weekdays.wed"),
      t("calendar.weekdays.thu"),
      t("calendar.weekdays.fri"),
      t("calendar.weekdays.sat")
    ];
    return weekdays[date.getDay()];
  };

  const formatMonthCaption = (date) => {
    return t("calendar.monthFormat", {
      month: date.toLocaleString(t("calendar.locale"), { month: "long" }),
      year: date.getFullYear()
    });
  };

  return (
    <div className={styles.calendarWrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t("calendar.selectDate")}</h3>
        <div className={styles.divider}></div>
      </div>
      <DayPicker
        mode="single"
        selected={value}
        onSelect={onChange}
        onMonthChange={onMonthChange}
        disabled={disabledDates}
        formatters={{
          formatWeekdayName,
          formatCaption: formatMonthCaption
        }}
        modifiersClassNames={{
          selected: styles.selectedDay,
          today: styles.today,
          disabled: styles.disabledDay
        }}
        styles={{
          root: { margin: 0 },
          caption: { color: '#2d3748', fontWeight: 500 },
          day: { margin: '0.2rem', borderRadius: '8px' }
        }}
      />
    </div>
  );
};

CalendarPicker.propTypes = {
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  nonWorkingDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
};

const TimeSlotPicker = ({
  selectedTimes,
  setSelectedTimes,
  selectedDate,
  roomId,
  selectedSeatDescription,
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
        const openHours = await fetchOpenHours(
          selectedDate,
          roomId,
          selectedSeatDescription
        );
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

  const handleTimeClick = (time) => {
    const index = availableTimes.indexOf(time);
    if (index === -1) return;

    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter(t => t !== time));
      return;
    }

    if (selectedTimes.length === 0 || 
        time === getNextTime(selectedTimes[selectedTimes.length - 1])) {
      setSelectedTimes([...selectedTimes, time]);
    } 
    else if (time === getPrevTime(selectedTimes[0])) {
      setSelectedTimes([time, ...selectedTimes]);
    }
    else if (isBetweenSelected(time)) {
      return;
    }
    else {
      setSelectedTimes([time]);
    }
  };

  const getNextTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const nextHour = hours + (minutes + 30 >= 60 ? 1 : 0);
    const nextMinute = (minutes + 30) % 60;
    return `${String(nextHour).padStart(2, '0')}:${String(nextMinute).padStart(2, '0')}`;
  };

  const getPrevTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const prevHour = hours - (minutes - 30 < 0 ? 1 : 0);
    const prevMinute = (minutes - 30 + 60) % 60;
    return `${String(prevHour).padStart(2, '0')}:${String(prevMinute).padStart(2, '0')}`;
  };

  const isBetweenSelected = (time) => {
    if (selectedTimes.length < 2) return false;
    const firstIndex = availableTimes.indexOf(selectedTimes[0]);
    const lastIndex = availableTimes.indexOf(selectedTimes[selectedTimes.length - 1]);
    const currentIndex = availableTimes.indexOf(time);
    return currentIndex > firstIndex && currentIndex < lastIndex;
  };

  const isTimeSelected = (time) => selectedTimes.includes(time);
  const isTimeFirstSelected = (time) => selectedTimes[0] === time;
  const isTimeLastSelected = (time) => selectedTimes[selectedTimes.length - 1] === time;

  const getTimeRows = () => {
    const rows = [];
    const slotsPerRow = 6;
    const totalRows = Math.ceil(availableTimes.length / slotsPerRow);

    for (let row = 0; row < totalRows; row++) {
      const startIdx = row * slotsPerRow;
      const endIdx = startIdx + slotsPerRow;
      const rowSlots = availableTimes.slice(startIdx, endIdx);

      while (rowSlots.length < slotsPerRow) {
        rowSlots.push(null);
      }

      rows.push(
        <div key={`row-${row}`} className={styles.timeRow}>
          {rowSlots.map((time, index) =>
            time ? (
              <button
                key={time}
                className={`${styles.timeSlot} ${
                  isTimeSelected(time) ? styles.selected : ""
                } ${isTimeFirstSelected(time) ? styles.firstSelected : ""} ${
                  isTimeLastSelected(time) ? styles.lastSelected : ""
                }`}
                onClick={() => handleTimeClick(time)}
                aria-label={`${t("timeSlots.timeSlot")} ${time}`}
                aria-pressed={isTimeSelected(time)}
              >
                {time}
              </button>
            ) : (
              <div
                key={`empty-${row}-${index}`}
                className={`${styles.timeSlot} ${styles.emptySlot}`}
                aria-hidden="true"
              />
            )
          )}
        </div>
      );
    }

    return rows;
  };

  if (!selectedDate) return null;

  return (
    <div className={styles.timeSection}>
      <div className={styles.header}>
        <h3 className={styles.sectionTitle}>{t("timeSlots.availableHours")}</h3>
        <div className={styles.divider}></div>
      </div>
      {loadingHours && (
        <div className={styles.loading}>{t("timeSlots.loadingHours")}</div>
      )}
      {errorHours && <div className={styles.error}>{errorHours}</div>}
      {!loadingHours && !errorHours && (
        <div className={styles.tableContainer}>
          <div className={styles.timeGrid}>{getTimeRows()}</div>
        </div>
      )}
    </div>
  );
};

TimeSlotPicker.propTypes = {
  selectedTimes: PropTypes.arrayOf(PropTypes.string),
  setSelectedTimes: PropTypes.func.isRequired,
  selectedDate: PropTypes.instanceOf(Date),
  roomId: PropTypes.string.isRequired,
  selectedSeatDescription: PropTypes.string.isRequired,
};

export { CalendarPicker, TimeSlotPicker };
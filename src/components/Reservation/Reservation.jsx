import React, { useState, useEffect } from "react";
import styles from "./Reservation.module.css";
import { CalendarPicker, PlaceSelection, TimeSlotPicker } from "./CombinedReservationPicker";
import { InfoTable as RoomInfoTable, Location, RoomDescription } from "./RoomInfoComponents";
import Button from "../UI/Button/Button";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { fetchRoomInfo } from "../../store/api";

const Reservation = () => {
  const { t } = useTranslation(["reservationRoom"]);
  const { roomId } = useParams();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  // `reservedSeats` тепер призначений для місць, ЗАБРОНЬОВАНИХ НА ОБРАНУ ДАТУ/ЧАС.
  // За замовчуванням, при завантаженні info про кімнату, ми не знаємо, які місця заброньовані.
  const [reservedSeats, setReservedSeats] = useState([]); 
  const [selectedTime, setSelectedTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPlaceSelection, setShowPlaceSelection] = useState(false);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    const loadRoomInfo = async () => {
      if (!roomId) return;

      setIsLoading(true);
      try {
        const data = await fetchRoomInfo(roomId);
        setRoomData({
          ...data.room,
          seats: data.seats // Усі об'єкти місць, які належать цій кімнаті
        });
        // **** ВИПРАВЛЕНО: НЕ встановлюємо `reservedSeats` тут ****
        // `reservedSeats` повинні бути місця, заброньовані НА ОБРАНУ ДАТУ.
        // Інформація про всі місця в кімнаті передається через `availableSeats` пропс у PlaceSelection.
        setReservedSeats([]); // Очищаємо, оскільки бронювання залежать від дати
      } catch (error) {
        console.error("Error loading room info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRoomInfo();
  }, [roomId]);

  useEffect(() => {
    if (selectedDate) {
      setSelectedSeats([]);
      setSelectedTime(null);
      setShowPlaceSelection(true);
      setShowTimeSlots(false);
      // При зміні дати, ми очищаємо раніше заброньовані місця,
      // оскільки вони залежать від обраної дати.
      setReservedSeats([]); // Потрібно отримати заброньовані місця для НОВОЇ дати
    } else {
      setShowPlaceSelection(false);
      setShowTimeSlots(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedSeats.length > 0 && selectedDate && roomData) {
      setShowTimeSlots(true);
    } else {
      setSelectedTime(null);
      setShowTimeSlots(false);
    }
  }, [selectedSeats, selectedDate, roomData]);

  // Функція для отримання заброньованих місць на конкретну дату та час
  // ЦЯ ФУНКЦІЯ ПОВИННА БУТИ ВИКЛИКАНА ПІСЛЯ ВИБОРУ ДАТИ ТА, МОЖЛИВО, ЧАСУ
  // АБО ВАШ `fetchOpenHours` ПОВИНЕН ПОВЕРТАТИ ЦЮ ІНФОРМАЦІЮ
  const fetchReservedSeatsForDateTime = async (date, time) => {
    // Тут має бути API-виклик до вашого бекенду, який повертає номери місць,
    // заброньованих для даної кімнати, дати та часу.
    // Наприклад:
    // const response = await fetchWithAuth(`getReservedSeats?roomId=${roomId}&date=${date}&time=${time}`);
    // setReservedSeats(response.reservedSeatNumbers);
    console.log("Fetching reserved seats for:", date, time);
    // Для демонстрації, припустимо, що деякі місця заброньовані.
    // У реальному додатку це має бути дані з бекенду.
    if (date && time && roomData?.seats.length > 0) {
      // ЦЕ ТИМЧАСОВА ЛОГІКА ДЛЯ ПРИКЛАДУ. В РЕАЛЬНОМУ ДОДАТКУ ЦІ ДАНІ НАДХОДЯТЬ З БЕКЕНДУ!
      // Припустимо, що місце 1 заброньоване на 09:00, місце 2 на 10:00 тощо.
      // Вам потрібно буде інтегрувати реальний API-виклик.
      // const dummyReserved = time === '09:00' ? [1] : time === '10:00' ? [2] : [];
      // setReservedSeats(dummyReserved);
    } else {
      setReservedSeats([]);
    }
  };

  useEffect(() => {
    if (selectedDate && selectedTime) {
      // Якщо обрані дата та час, можна спробувати завантажити заброньовані місця
      // fetchReservedSeatsForDateTime(selectedDate, selectedTime);
      // АБО, якщо ваш `fetchOpenHours` повертає цю інфо, то це буде оброблятися там.
    }
  }, [selectedDate, selectedTime]); // Залежність від дати та часу

  const handleReservation = () => {
    if (selectedDate && selectedTime && selectedSeats.length > 0 && roomData) {
      setIsLoading(true);
      // Вам потрібен API-виклик для створення бронювання.
      // Передайте id кімнати, дату, час та ID обраних місць.
      const seatIdsToReserve = roomData.seats
        .filter(seat => selectedSeats.includes(seat.seat_number))
        .map(seat => seat.id);

      console.log('Reservation details:', {
        roomId: roomData.id,
        date: selectedDate.toLocaleDateString('en-CA'), // Формат 'YYYY-MM-DD'
        startTime: selectedTime,
        seatIds: seatIdsToReserve
      });

      // Приклад виклику API для бронювання:
      // try {
      //   await makeReservation({
      //     roomId: roomData.id,
      //     date: selectedDate.toISOString().split('T')[0],
      //     startTime: selectedTime,
      //     seatIds: seatIdsToReserve
      //   });
      //   alert(t("reservation.success"));
      //   // Оновити список заброньованих місць після успішного бронювання
      //   fetchReservedSeatsForDateTime(selectedDate, selectedTime);
      // } catch (error) {
      //   console.error("Reservation failed:", error);
      //   alert(t("reservation.error"));
      // } finally {
      //   setIsLoading(false);
      // }

      // Тимчасова логіка для демонстрації:
      setTimeout(() => {
        alert(
          `Zarezerwowano salę ${roomData?.name || 'A101'} на ${selectedDate.toLocaleDateString()} о ${selectedTime} для місць: ${selectedSeats.join(', ')}`
        );
        setIsLoading(false);
      }, 1500);
    } else {
      alert("Будь ласка, оберіть дату, час та місце(я) для бронювання.");
    }
  };

  if (isLoading && !roomData) {
    return <div className={styles.loading}>{t("loading")}</div>;
  }

  if (!roomData) {
    return <div className={styles.error}>{t("errors.roomNotFound")}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.imagePlaceholder}>
          {roomData.photo_url ? (
            <img
              src={roomData.photo_url}
              alt={roomData.name}
              className={styles.roomImage}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/600x350?text=Room+Image';
              }}
            />
          ) : (
            <div className={styles.defaultImage}>
              <span>{t("roomDescription.noImageAvailable")}</span>
            </div>
          )}
          <div className={styles.imageOverlay}>
            <h2 className={styles.imageTitle}>
              {t("roomDescription.roomNumber", { number: `#${roomData.name}` })}
            </h2>
            <p className={styles.imageSubtitle}>
              {roomData.location}
            </p>
          </div>
        </div>

        <CalendarPicker
          value={selectedDate}
          onChange={setSelectedDate}
        />

        {showPlaceSelection && (
          <PlaceSelection
            onSeatSelect={setSelectedSeats}
            // **** ВИПРАВЛЕНО: Передаємо усі фактичні місця кімнати як availableSeats ****
            // `availableSeats` - це місця, які КОМПОНЕНТ PlaceSelection повинен відображати.
            availableSeats={roomData.seats || []}
            // `reservedSeats` - це місця, які вже ЗАБРОНЬОВАНІ на обрану дату/час.
            // Наразі вони мають бути отримані з API після вибору дати.
            reservedSeats={reservedSeats}
            selectedSeats={selectedSeats}
            isLoading={isLoading}
          />
        )}

        {selectedDate && selectedSeats.length > 0 && selectedTime && (
          <div className={styles.actionSection}>
            <Button
              variant="primary"
              loading={isLoading}
              onClick={handleReservation}
              disabled={isLoading}
              showTextSpan
            >
              {t("reservation.reserveNow")}
            </Button>
          </div>
        )}
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.headerSection}>
          <h1 className={styles.roomTitle}>
            {roomData.name}
          </h1>
          <div className={styles.roomMeta}>
            <span className={styles.metaItem}>
              {t("reservation.capacity", { count: roomData.seats?.length || 0 })} {/* Використовуємо фактичну кількість місць */}
            </span>
          </div>
        </div>

        <Location address={roomData.location} />
        <RoomDescription room={roomData} />
        <RoomInfoTable seats={roomData?.seats || []} />

        {showTimeSlots && (
          <TimeSlotPicker
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            selectedDate={selectedDate}
            roomId={roomData.id}
            // Можливо, тут потрібно буде передати `setReservedSeats` як колбек,
            // якщо `TimeSlotPicker` буде отримувати цю інформацію від API.
            // setReservedSeats={setReservedSeats}
          />
        )}
      </div>
    </div>
  );
};

export default Reservation;
import React, { useState, useEffect } from "react";
import styles from "./Reservation.module.css";
import { CalendarPicker, TimeSlotPicker } from "./CombinedReservationPicker";
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
  const [selectedSeatDescription, setSelectedSeatDescription] = useState('');
  const [reservedSeats, setReservedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
          seats: data.seats
        });
        setReservedSeats([]);
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
      setSelectedSeatDescription('');
      setSelectedTime(null);
      setShowTimeSlots(false);
      setReservedSeats([]);
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

  const handleSeatSelect = (seat) => {
    if (!seat) {
      setSelectedSeats([]);
      setSelectedSeatDescription('');
      return;
    }

    setSelectedSeats([seat.seat_number]);
    setSelectedSeatDescription(seat.description || '');
  };

  const handleReservation = () => {
    if (selectedDate && selectedTime && selectedSeats.length > 0 && roomData) {
      setIsLoading(true);
      const seatIdsToReserve = roomData.seats
        .filter(seat => selectedSeats.includes(seat.seat_number))
        .map(seat => seat.id);

      console.log('Reservation details:', {
        roomId: roomData.id,
        date: selectedDate.toLocaleDateString('en-CA'),
        startTime: selectedTime,
        seatIds: seatIdsToReserve
      });

      setTimeout(() => {
        alert(
          `${t("reservation.success")} ${roomData?.name || 'A101'} ${t("reservation.for")} ${selectedDate.toLocaleDateString()} ${t("reservation.at")} ${selectedTime}`
        );
        setIsLoading(false);
      }, 1500);
    } else {
      alert(t("reservation.missingFields"));
    }
  };

  if (isLoading && !roomData) {
    return <div className={styles.loading}>{t("placeSelection.status.loading")}</div>;
  }

  if (!roomData) {
    return <div className={styles.error}>{t("errors.roomNotFound")}</div>;
  }

  return (
    <div className={styles.container}>
      {/* Новий div для об'єднання лівої та правої панелей */}
      <div className={styles.contentWrapper}>
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

          <Location address={roomData.location} />

          <CalendarPicker
            value={selectedDate}
            onChange={setSelectedDate}
          />
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.headerSection}>
            <h1 className={styles.roomTitle}>
              {roomData.name}
            </h1>
            <div className={styles.roomMeta}>
              <span className={styles.metaItem}>
                {t("reservation.capacity", { count: roomData.seats?.length || 0 })}
              </span>
            </div>
          </div>

          <RoomDescription room={roomData} />

          {selectedDate && (
            <RoomInfoTable
              seats={roomData.seats || []}
              onSeatSelect={handleSeatSelect}
              reservedSeats={reservedSeats}
              selectedSeats={selectedSeats}
              isLoading={isLoading}
            />
          )}
          {showTimeSlots && (
            <TimeSlotPicker
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              selectedDate={selectedDate}
              roomId={roomData.id}
              selectedSeatDescription={selectedSeatDescription}
            />
          )}
        </div>
      </div>

      {selectedDate && selectedSeats.length > 0 && selectedTime && (
        <div className={styles.actionSection}>
          <Button
            variant="primary"
            loading={isLoading}
            onClick={handleReservation}
            disabled={isLoading}
            showTextSpan
            className={styles.reservationButton}
          >
            {t("reservation.reserveNow")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Reservation;
import React, { useState, useEffect, useRef } from "react";
import styles from "./Reservation.module.css";
import { CalendarPicker, TimeSlotPicker } from "./CombinedReservationPicker";
import {
  InfoTable as RoomInfoTable,
  Location,
  RoomDescription,
} from "./RoomInfoComponents";
import Button from "../UI/Button/Button";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRoomInfo, reserveSeat, fetchOpenHours } from "../../store/api";
import { useAuthToast } from "../../components/UI/ToastAuth/ToastAuth";
import { supabase } from "../../supabaseClient";

const Reservation = () => {
  const { t } = useTranslation(["reservationRoom"]);
  const authToast = useAuthToast();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const calendarRef = useRef(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedSeatDescription, setSelectedSeatDescription] = useState("");
  const [reservedSeats, setReservedSeats] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const [nonWorkingDates, setNonWorkingDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const loadRoomInfo = async () => {
      if (!roomId) return;

      setIsLoading(true);
      try {
        const data = await fetchRoomInfo(roomId);
        setRoomData({
          ...data.room,
          seats: data.seats,
        });
        setReservedSeats([]);
      } catch (error) {
        console.error("Error loading room info:", error);
        authToast.error(t("errors.roomLoadError"));
      } finally {
        setIsLoading(false);
      }
    };

    loadRoomInfo();
  }, [roomId]);

  useEffect(() => {
    if (selectedDate) {
      setSelectedSeats([]);
      setSelectedSeatDescription("");
      setSelectedTimes([]);
      setShowTimeSlots(false);
      setReservedSeats([]);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedSeats.length > 0 && selectedDate && roomData) {
      setShowTimeSlots(true);
    } else {
      setSelectedTimes([]);
      setShowTimeSlots(false);
    }
  }, [selectedSeats, selectedDate, roomData]);

  const checkDateAvailability = async (date) => {
    if (!roomData || !roomData.seats?.[0]) return false;
    
    try {
      const openHours = await fetchOpenHours(
        date, 
        roomData.id, 
        roomData.seats[0].description || ""
      );
      return openHours.length > 0;
    } catch (error) {
      console.error("Error checking date availability:", error);
      return false;
    }
  };

  const handleMonthChange = async (month) => {
    setCurrentMonth(month);
    setIsLoading(true);
    
    try {
      const daysInMonth = new Date(
        month.getFullYear(), 
        month.getMonth() + 1, 
        0
      ).getDate();
      
      const nonWorking = [];
      
      for (let day = 1; day <= Math.min(daysInMonth, 10); day++) {
        const date = new Date(month.getFullYear(), month.getMonth(), day);
        const isAvailable = await checkDateAvailability(date);
        if (!isAvailable) {
          nonWorking.push(date);
        }
      }
      
      setNonWorkingDates(nonWorking);
    } catch (error) {
      console.error("Error loading non-working dates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = async (date) => {
    if (!date) return;
    
    const isAvailable = await checkDateAvailability(date);
    if (isAvailable) {
      setSelectedDate(date);
    } else {
      authToast.warn(t("timeSlots.noAvailableHours"));
    }
  };

  const handleSeatSelect = (seat) => {
    if (!seat) {
      setSelectedSeats([]);
      setSelectedSeatDescription("");
      return;
    }

    setSelectedSeats([seat.seat_number]);
    setSelectedSeatDescription(seat.description || "");
  };

  const handleReservation = async () => {
    if (selectedDate && selectedTimes.length > 0 && selectedSeats.length > 0 && roomData) {
      setIsLoading(true);

      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          throw new Error("Unauthorized");
        }

        const formattedDate = selectedDate.toISOString().split('T')[0];
        const startTime = selectedTimes[0];
        const endTime = getNextTime(selectedTimes[selectedTimes.length - 1]);

        const reservationData = {
          user_id: user.id,
          room_id: roomData.id,
          seat_desc: selectedSeatDescription,
          start_time: startTime,
          end_time: endTime,
          date: formattedDate,
        };

        await reserveSeat(reservationData);

        authToast.success(t("reservation.success", {
          seat: selectedSeatDescription || `№${selectedSeats[0]}`,
          room: roomData?.name || 'Error',
          date: selectedDate.toLocaleDateString(),
          startTime: startTime,
          endTime: endTime
        }));

        setReservedSeats([...reservedSeats, ...selectedSeats]);
        setSelectedSeats([]);
        setSelectedTimes([]);
        navigate("/my-reservations");
      } catch (error) {
        console.error("Reservation error:", error);
        
        if (error.message.includes("No available seats")) {
          authToast.error(t("errors.conflict"));
        } else if (error.message.includes("Unauthorized")) {
          authToast.error(t("errors.unauthorized"));
        } else {
          authToast.error(t("errors.default"));
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      authToast.warn(t("reservation.missingFields"));
    }
  };

  const getNextTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const nextHour = hours + (minutes + 30 >= 60 ? 1 : 0);
    const nextMinute = (minutes + 30) % 60;
    return `${String(nextHour).padStart(2, "0")}:${String(nextMinute).padStart(
      2,
      "0"
    )}`;
  };

  if (isLoading && !roomData) {
    return (
      <div className={styles.loading}>{t("placeSelection.status.loading")}</div>
    );
  }

  if (!roomData) {
    return <div className={styles.error}>{t("errors.roomNotFound")}</div>;
  }

  return (
    <div className={styles.container}>
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
                  e.target.src =
                    "https://via.placeholder.com/600x350?text=Room+Image";
                }}
              />
            ) : (
              <div className={styles.defaultImage}>
                <span>{t("roomDescription.noImageAvailable")}</span>
              </div>
            )}
            <div className={styles.imageOverlay}>
              <h2 className={styles.imageTitle}>
                {t("roomDescription.roomNumber", {
                  number: `#${roomData.name}`,
                })}
              </h2>
              <p className={styles.imageSubtitle}>{roomData.location}</p>
            </div>
          </div>

          <Location address={roomData.location} />

          <div ref={calendarRef}>
            <CalendarPicker 
              value={selectedDate} 
              onChange={handleDateChange}
              nonWorkingDates={nonWorkingDates}
              onMonthChange={handleMonthChange}
            />
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.headerSection}>
            <h1 className={styles.roomTitle}>{roomData.name}</h1>
            <div className={styles.roomMeta}>
              <span className={styles.metaItem}>
                {t("reservation.capacity", {
                  count: roomData.seats?.length || 0,
                })}
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
              selectedTimes={selectedTimes}
              setSelectedTimes={setSelectedTimes}
              selectedDate={selectedDate}
              roomId={roomData.id}
              selectedSeatDescription={selectedSeatDescription}
            />
          )}
        </div>
      </div>

      {selectedDate && selectedSeats.length > 0 && selectedTimes.length > 0 && (
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
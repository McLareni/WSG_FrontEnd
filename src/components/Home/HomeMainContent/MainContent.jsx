import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./MainContent.module.css";
import RoomCard from "../../../components/UI/RoomCard/RoomCard";
import SearchAndSort from "../../../components/UI/SearchAndSort/SearchAndSort";
import roomImage from "../../../assets/images/room.jpg";

const dummyRooms = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: `SALA #${["A", "B", "C", "D", "E", "F"][i]}${101 + i}`,
  imageSrc: roomImage,
  category: "computerScience", // ключ категорії для перекладу
  schedule: {
    Monday: "08:00 – 18:00",
    Tuesday: "08:00 – 18:00",
    Wednesday: "08:00 – 18:00",
    Thursday: "Day off",
    Friday: "10:00 – 15:00",
    Saturday: "Day off",
    Sunday: "Day off",
  },
}));

const MainContent = () => {
  const { t } = useTranslation("homePage");

  const handleReserve = (roomName) => {
    alert(t("room.reserveAlert", { roomName }));
  };

  return (
    <main className={styles.main}>
      <SearchAndSort />

      <div className={styles.grid}>
        {dummyRooms.map((room) => (
          <RoomCard
            key={room.id}
            name={room.name}
            imageSrc={room.imageSrc}
            category={t(`room.category.${room.category}`)}
            schedule={Object.entries(room.schedule).reduce(
              (acc, [day, hours]) => {
                const dayKey = day.toLowerCase();
                acc[t(`days.${dayKey}`)] =
                  hours === "Day off" || hours === "Dzień wolny"
                    ? t("days.dayOff")
                    : hours;
                return acc;
              },
              {}
            )}
            onReserve={handleReserve}
          />
        ))}
      </div>
    </main>
  );
};

export default MainContent;

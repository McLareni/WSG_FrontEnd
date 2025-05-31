// src/components/Home/HomeMainContent/MainContent.jsx
import React from "react";
import styles from "./MainContent.module.css";
import RoomCard from "../../../components/UI/RoomCard/RoomCard";
import SearchAndSort from "../../../components/UI/SearchAndSort/SearchAndSort";
import roomImage from "../../../assets/images/room.jpg";

const dummyRooms = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: `SALA #${["A", "B", "C", "D", "E", "F"][i]}${101 + i}`,
  imageSrc: roomImage,
  category: "Informatyka",
  schedule: {
    Poniedziałek: "08:00 – 18:00",
    Wtorek: "08:00 – 18:00",
    Środa: "08:00 – 18:00",
    Czwartek: "Dzień wolny",
    Piątek: "10:00 – 15:00",
    Sobota: "Dzień wolny",
    Niedziela: "Dzień wolny",
  },
}));

const MainContent = () => {
  const handleReserve = (roomName) => {
    alert(`Резервую: ${roomName}`);
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
            category={room.category}
            schedule={room.schedule}
            onReserve={handleReserve}
          />
        ))}
      </div>
    </main>
  );
};

export default MainContent;

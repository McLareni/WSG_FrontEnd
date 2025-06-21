import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./MainContent.module.css";
import RoomCard from "../../../components/UI/RoomCard/RoomCard";
import SearchAndSort from "../../../components/UI/SearchAndSort/SearchAndSort";
import axios from "axios";
import useAuthStore from "../../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const URL = import.meta.env.VITE_URL;

const MainContent = () => {
  const { t } = useTranslation("homePage");
  const { session } = useAuthStore();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);

  const handleReserve = (id) => {
    navigate(`/reservation/${id}`);
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchRooms() {
      try {
        const response = await axios.get(URL + "getRooms", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        if (isMounted) setRooms(response.data || []);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    }

    fetchRooms();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className={styles.main}>
      <SearchAndSort />
      {rooms.length > 0 && rooms ? (
        <div className={styles.grid}>
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              name={room.name}
              imageSrc={room.photo_url}
              category={t(`categories.${room.type}`)}
              schedule={room.schedule}
              onReserve={() => handleReserve(room.id)}
            />
          ))}
        </div>
      ) : (
        <p>Rooms is Loading</p>
      )}
    </main>
  );
};

export default MainContent;

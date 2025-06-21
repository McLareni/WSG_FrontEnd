import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./MainContent.module.css";
import RoomCard from "../../../components/UI/RoomCard/RoomCard";
import SearchAndSort from "../../../components/UI/SearchAndSort/SearchAndSort";
import axios from "axios";
import useAuthStore from "../../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../../hooks/useDebounce";

const URL = import.meta.env.VITE_URL;

const SORT_BY = {
  name: "name",
  teacher: "teacher_id",
  date: "created_at",
};

const MainContent = () => {
  const { t } = useTranslation("homePage");
  const { session } = useAuthStore();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [category, setCategory] = useState("");
  const [rooms, setRooms] = useState([]);

  const debouncedText = useDebounce(searchValue, 400);

  const handleReserve = (id) => {
    navigate(`/reservation/${id}`);
  };

  async function fetchRooms() {
    try {
      const response = await axios.get(URL + "getRooms", {
        params: {
          text: searchValue,
          sortBy: SORT_BY[sortBy] || "",
          type: category,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      setRooms(response.data || []);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    }
  }

  useEffect(() => {
    if (debouncedText !== "") {
      fetchRooms();
    }
  }, [debouncedText]);

  useEffect(() => {
    fetchRooms();
  }, [sortBy, category]);

  return (
    <main className={styles.main}>
      <SearchAndSort
        changeCategory={setCategory}
        changeSortBy={setSortBy}
        changeSearchValue={setSearchValue}
      />
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

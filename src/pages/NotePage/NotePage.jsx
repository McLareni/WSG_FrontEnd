import { use, useEffect, useState } from "react";
import styles from "./NotePage.module.css";
import SearchableDropdown from "../../components/UI/SearchableDropdown/SearchableDropdown";
import useAuthStore from "../../store/useAuthStore";
import axios from "axios";
import useDebounce from "../../hooks/useDebounce";
import { useTranslation } from "react-i18next";
import { set } from "date-fns";

const URL = import.meta.env.VITE_URL;

const NotesListPage = () => {
  const { session } = useAuthStore();
  const { t } = useTranslation("notePage");

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomQuery, setRoomQuery] = useState("");
  const [notes, setNotes] = useState([]);

  const listRoomNames = rooms.map((room) => room.name);

  const debouncedQueryRoom = useDebounce(roomQuery, 400);

  async function fetchRooms() {
    try {
      const res = await axios.get(URL + "getRooms", {
        headers: {
          Authorization: "Bearer " + session.access_token,
        },
      });
      if (res.status === 200) {
        setRooms(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching suggestions", error);
    }
  }

  useEffect(() => {
    async function fetchNotes() {
      const response = await axios.get(URL + "getAllNotes/" + selectedRoom.id, {
        headers: {
          Authorization: "Bearer " + session.access_token,
        },
      });

      setNotes(response.data.notes || []);
    }

    fetchNotes();
  }, [selectedRoom]);

  useEffect(() => {
    if (debouncedQueryRoom !== "") {
      fetchRooms(debouncedQueryRoom);
    }
  }, [debouncedQueryRoom]);

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div>
        {t("selectRoom")}
        <SearchableDropdown
          options={listRoomNames}
          option={selectedRoom?.name || ""}
          onChangeText={(text) => setRoomQuery(text)}
          onSelect={(name) => {
            setSelectedRoom(rooms.find((room) => room.name === name));
          }}
        />
      </div>
      {notes.length === 0 && selectedRoom && (
        <div className={styles.noNotes}>{t("noNotes")}</div>
      )}
      <ul className={styles.list}>
        {notes.map((note) => (
          <li key={note.id} className={styles.noteItem}>
            <div className={styles.noteHeader}>
              <span className={styles.userName}>
                {note.user_details.first_name} {note.user_details.last_name}
              </span>
              <span className={styles.noteDate}>
                {new Date(note.created_at).toLocaleDateString("uk-UA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className={styles.noteText}>{note.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default NotesListPage;

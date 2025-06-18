import { useEffect, useState } from "react";
import Dropdown from "../../components/UI/Dropdown/Dropdown";
import styles from "./NotePage.module.css";
import { VictoryChart, VictoryLine, VictoryTheme } from "victory";
import SearchableDropdown from "../../components/UI/SearchableDropdown/SearchableDropdown";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";
import useDebounce from "../../hooks/useDebounce";

const CHART_TYPES = ["Line Chart", "Bar Chart", "Pie Chart", "Radar Chart"];
const URL = import.meta.env.VITE_URL;

const NotesPage = () => {
  const { session } = useAuthStore();

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedChartType, setSelectedChartType] = useState("");
  const [typeQuery, setTypeQuery] = useState("");
  const [data, setData] = useState([]);

  const debouncedQuery = useDebounce(typeQuery, 400);

  const listRoomNames = rooms.map((room) => room.name);

  async function fetchTypes(search) {
    try {
      const res = await axios.get(URL + "getTypeForMeasurements", {
        params: { search },
        headers: {
          Authorization: "Bearer " + session.access_token,
        },
      });
      if (res.status === 200) {
        setTypes(res.data.types || []);
      }
    } catch (error) {
      console.error("Error fetching suggestions", error);
    }
  }

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
    fetchTypes("");
    fetchRooms("");

    if (CHART_TYPES.length > 0) {
      setSelectedChartType(CHART_TYPES[0]);
    }
  }, []);

  useEffect(() => {
    if (debouncedQuery !== "") {
      fetchTypes(debouncedQuery);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    async function fetchMeasurements() {
      const response = await axios.post(
        URL + "getMeasurementsByType",
        {
          type: selectedType,
          room_id: selectedRoom.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + session.access_token,
          },
        }
      );
      if (response.status === 200) {
        setData(
          response.data.measurements.map((measurement) => measurement.value) ||
            []
        );
      }
    }

    if ((selectedType.length > 0, selectedRoom)) {
      fetchMeasurements();
    }
  }, [selectedType, selectedRoom]);

  return (
    <main className="">
      <section className={styles.filters}>
        Select a room
        <SearchableDropdown
          options={listRoomNames}
          onSelect={(name) =>
            setSelectedRoom(rooms.find((room) => room.name === name))
          }
        />
        Select type
        <SearchableDropdown
          options={types}
          onSelect={setSelectedType}
          onChangeText={setTypeQuery}
        />
        Select type of chart
        <Dropdown
          selected={selectedChartType}
          options={CHART_TYPES}
          onSelect={setSelectedChartType}
        />
      </section>

      <section className={styles["chart-container"]}>
        {selectedChartType === "Line Chart" && (
          <VictoryChart theme={VictoryTheme.clean}>
            <VictoryLine data={data} />
          </VictoryChart>
        )}
      </section>
    </main>
  );
};

export default NotesPage;

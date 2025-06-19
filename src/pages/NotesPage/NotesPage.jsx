import { useEffect, useState } from "react";
import Dropdown from "../../components/UI/Dropdown/Dropdown";
import styles from "./NotePage.module.css";
import { VictoryChart, VictoryLine, VictoryTheme } from "victory";
import SearchableDropdown from "../../components/UI/SearchableDropdown/SearchableDropdown";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";
import useDebounce from "../../hooks/useDebounce";
import { unitsConverter } from "../../utils/units";

const CHART_TYPES = ["Line Chart", "Bar Chart", "Pie Chart", "Radar Chart"];
const URL = import.meta.env.VITE_URL;

const NotesPage = () => {
  const { session } = useAuthStore();

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedChartType, setSelectedChartType] = useState("");
  const [typeQuery, setTypeQuery] = useState("");
  const [roomQuery, setRoomQuery] = useState("");

  const [data, setData] = useState([]);

  const debouncedQueryType = useDebounce(typeQuery, 400);
  const debouncedQueryRoom = useDebounce(roomQuery, 400);

  const listRoomNames = rooms.map((room) => room.name);

  async function fetchTypes(search) {
    try {
      const res = await axios.get(URL + "getTypeForMeasurements", {
        params: { search, room_id: selectedRoom.id },
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
    fetchRooms("");

    if (CHART_TYPES.length > 0) {
      setSelectedChartType(CHART_TYPES[0]);
    }
  }, []);

  useEffect(() => {
    if (debouncedQueryType !== "") {
      fetchTypes(debouncedQueryType);
    }

    if (debouncedQueryRoom !== "") {
      fetchRooms(debouncedQueryRoom);
    }
  }, [debouncedQueryRoom, debouncedQueryType]);

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
        setData(unitsConverter(response.data.measurements));
      }
    }

    if (selectedType?.length > 0 && selectedRoom) {
      fetchMeasurements();
    }

    console.log(selectedType, selectedRoom);
  }, [selectedType, selectedRoom]);

  console.log(data);

  return (
    <main className="">
      <section className={styles.filters}>
        Select a room
        <SearchableDropdown
          options={listRoomNames}
          option={selectedRoom?.name || ""}
          onChangeText={(text) => setRoomQuery(text)}
          onSelect={(name) => {
            setSelectedRoom(rooms.find((room) => room.name === name));
          }}
        />
        Select type
        <SearchableDropdown
          options={types}
          option={selectedType}
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
            <VictoryLine
              data={data
                .filter((measurement) => measurement.active)
                .map((measurement) => measurement.value)}
            />
          </VictoryChart>
        )}
      </section>
      <section className={styles.measurements}>
        <h3>Measurements</h3>
        {Array.isArray(data) && data.length > 0 ? (
          <table className={styles.measurementsTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Value</th>
                <th>Unit</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {data.map((measurement, idx) => (
                <tr key={measurement.id || idx}>
                  <td>
                    {measurement.created_at
                      ? new Date(measurement.created_at).toLocaleString()
                      : "-"}
                  </td>
                  <td>{measurement.value}</td>
                  <td>{measurement.unit}</td>
                  <td>{measurement.active ? "Valid" : "Invalid"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No measurements to display.</p>
        )}
      </section>
    </main>
  );
};

export default NotesPage;

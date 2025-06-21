import { useEffect, useState } from "react";
import Dropdown from "../../components/UI/Dropdown/Dropdown";
import styles from "./MeasurementsPage.module.css";
import { VictoryChart, VictoryLine, VictoryTheme } from "victory";
import SearchableDropdown from "../../components/UI/SearchableDropdown/SearchableDropdown";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";
import useDebounce from "../../hooks/useDebounce";
import { unitsConverter } from "../../utils/units";
import { useTranslation } from "react-i18next";

const URL = import.meta.env.VITE_URL;


const NotesPage = () => {
  const { session } = useAuthStore();
  const { t } = useTranslation("notePage");

  const CHART_TYPES = [
    { key: "line", label: t("chartTypes.line") },
    { key: "bar", label: t("chartTypes.bar") },
    { key: "pie", label: t("chartTypes.pie") },
    { key: "radar", label: t("chartTypes.radar") },
  ];

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedChartType, setSelectedChartType] = useState("line");
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
  }, [selectedType, selectedRoom]);

  return (
    <main className="">
      <section className={styles.filters}>
        {t("selectRoom")}
        <SearchableDropdown
          options={listRoomNames}
          option={selectedRoom?.name || ""}
          onChangeText={(text) => setRoomQuery(text)}
          onSelect={(name) => {
            setSelectedRoom(rooms.find((room) => room.name === name));
          }}
        />
        {t("selectType")}
        <SearchableDropdown
          options={types}
          option={selectedType}
          onSelect={setSelectedType}
          onChangeText={setTypeQuery}
        />
        {t("selectChartType")}
        <Dropdown
          selected={
            CHART_TYPES.find((type) => type.key === selectedChartType)?.label ||
            ""
          }
          options={CHART_TYPES.map((type) => type.label)}
          onSelect={(label) => {
            const selected = CHART_TYPES.find((type) => type.label === label);
            setSelectedChartType(selected?.key || "line");
          }}
        />
      </section>

      <section className={styles["chart-container"]}>
        {selectedChartType === "line" && (
          <VictoryChart theme={VictoryTheme.clean}>
            <VictoryLine
              data={data
                .filter((measurement) => measurement.active)
                .map((measurement) => measurement.value)
                .reverse()}
            />
          </VictoryChart>
        )}
      </section>
      <section className={styles.measurements}>
        <h3>{t("measurements")}</h3>
        {Array.isArray(data) && data.length > 0 ? (
          <table className={styles.measurementsTable}>
            <thead>
              <tr>
                <th>{t("table.date")}</th>
                <th>{t("table.value")}</th>
                <th>{t("table.unit")}</th>
                <th>{t("table.active")}</th>
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
                  <td>
                    {measurement.active ? t("table.valid") : t("table.invalid")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>{t("table.noData")}</p>
        )}
      </section>
    </main>
  );
};

export default NotesPage;

import { useState } from "react";
import styles from "./AddNotePage.module.css";
import Input from "../../components/UI/Input/Input";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../../store/useAuthStore.js";
import MeasurementTable from "../../components/AddNote/MeasurementTable/MeasurementTable.jsx";
import { useTranslation } from "react-i18next";

const URL = import.meta.env.VITE_URL;

export default function AddNotePage() {
  const { session } = useAuthStore();
  const { t } = useTranslation("addNote");
  const { roomId, reservationId } = useParams();
  const [note, setNote] = useState("");
  const [measurements, setMeasurements] = useState([
    { type: "", value: "", unit: "" },
  ]);

  const navigate = useNavigate();

  const addRow = () => {
    setMeasurements([...measurements, { type: "", value: "", unit: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!note.trim()) {
      toast.error(t("addNotePage.errors.emptyNote"));
      return;
    }

    if (measurements.some((m) => !m.type || !m.value || !m.unit)) {
      toast.error(t("addNotePage.errors.incompleteMeasurements"));
      return;
    }

    const response = await axios.post(
      URL + "addNote",
      {
        classroom_id: roomId,
        id_reservation: reservationId,
        note,
        measurements,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + session.access_token,
        },
      }
    );

    if (response.status === 200) {
      toast.success(t("addNotePage.success"));
      navigate("/notes");
    }
  };

  return (
    <div className={styles.container}>
      <h2>{t("addNotePage.title")}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label={t("addNotePage.noteLabel")}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t("addNotePage.notePlaceholder")}
          isTextarea
        />

        <div className={styles.tableWrapper}>
          <h3>{t("addNotePage.measurementsTitle")}</h3>
          {measurements.length > 0 && (
            <MeasurementTable
              measurements={measurements}
              updateMeasuremets={setMeasurements}
            />
          )}
          <button type="button" onClick={addRow}>
            {t("addNotePage.addRow")}
          </button>
        </div>

        <button type="submit">{t("addNotePage.submit")}</button>
      </form>
    </div>
  );
}

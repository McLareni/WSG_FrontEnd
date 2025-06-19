import { useState } from "react";
import styles from "./AddNotePage.module.css";
import Input from "../../components/UI/Input/Input";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../../store/useAuthStore.js";
import MeasurementTable from "../../components/AddNote/MeasurementTable/MeasurementTable.jsx";

const URL = import.meta.env.VITE_URL;

export default function AddNotePage() {
  const { session } = useAuthStore();
  const { roomId, reservationId } = useParams();
  const [note, setNote] = useState("");
  const [measurements, setMeasurements] = useState([
    { type: "", value: "", unit: "" },
  ]);

  const addRow = () => {
    setMeasurements([...measurements, { type: "", value: "", unit: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!note.trim()) {
      toast.error("Note cannot be empty");
    }

    if (measurements.some((m) => !m.type || !m.value || !m.unit)) {
      toast.error("All measurement fields must be filled");
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
      toast.success("Note and measurements added successfully");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add Note and Measurements</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Note:"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write your note..."
          isTextarea
        />

        <div className={styles.tableWrapper}>
          <h3>Measurements</h3>
          {measurements.length > 0 && (
            <MeasurementTable
              measurements={measurements}
              updateMeasuremets={setMeasurements}
            />
          )}
          <button type="button" onClick={addRow}>
            + Add Row
          </button>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

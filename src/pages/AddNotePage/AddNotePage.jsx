import { useRef, useState } from "react";
import styles from "./AddNotePage.module.css";
import Input from "../../components/UI/Input/Input";
import { getUnitCategory, unitsByCategory } from "../../utils/units.js";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../../store/useAuthStore.js";

const URL = import.meta.env.VITE_URL;

export default function AddNotePage() {
  const { session } = useAuthStore();
  const { roomId, reservationId } = useParams();
  const [note, setNote] = useState("");
  const [measurements, setMeasurements] = useState([
    { type: "", value: "", unit: "" },
  ]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeInputIndex, setActiveInputIndex] = useState(null);

  const addRow = () => {
    setMeasurements([...measurements, { type: "", value: "", unit: "" }]);
  };

  const removeRow = (index) => {
    const updated = measurements.filter((_, i) => i !== index);
    setMeasurements(updated);
  };

  const debounceTimeout = useRef(null);

  const fetchSuggestions = async (search) => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await axios.get(URL + "getTypeForMeasurements", {
        params: { search },
        headers: {
          Authorization: "Bearer " + session.access_token,
        },
      });
      if (res.status === 200) {
        setSuggestions(res.data.types || []);
      }
    } catch (error) {
      console.error("Error fetching suggestions", error);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...measurements];
    updated[index][field] =
      field === "type"
        ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        : value;
    setMeasurements(updated);

    if (field === "type") {
      setActiveInputIndex(index);

      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        fetchSuggestions(
          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        );
      }, 500);
    }
  };

  const selectSuggestion = (index, suggestion) => {
    const updated = [...measurements];
    updated[index].type = suggestion;
    setMeasurements(updated);
    setSuggestions([]);
    setActiveInputIndex(null);
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

  console.log(suggestions);

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
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Value</th>
                  <th>Unit</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {measurements.map((m, index) => (
                  <tr key={index}>
                    <td className={styles.typeCell}>
                      <input
                        type="text"
                        value={m.type}
                        onChange={(e) =>
                          handleChange(index, "type", e.target.value)
                        }
                        placeholder="e.g. temperature"
                        autoComplete="off"
                        onFocus={() => setActiveInputIndex(index)}
                        onBlur={() => setTimeout(() => setSuggestions([]), 150)}
                      />
                      {activeInputIndex === index && suggestions.length > 0 && (
                        <ul className={styles.suggestionsList}>
                          {suggestions.map((suggestion, i) => (
                            <li
                              key={i}
                              className={styles.suggestionItem}
                              onMouseDown={() =>
                                selectSuggestion(index, suggestion)
                              }
                            >
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td>
                      <input
                        type="number"
                        value={m.value}
                        onChange={(e) =>
                          handleChange(index, "value", e.target.value)
                        }
                        placeholder="e.g. 23.4"
                        step="any"
                      />
                    </td>
                    <td>
                      <select
                        value={m.unit}
                        onChange={(e) =>
                          handleChange(index, "unit", e.target.value)
                        }
                      >
                        <option value="">Select unit</option>
                        {(() => {
                          const unitCategory = getUnitCategory(m?.type);

                          if (unitCategory) {
                            return (
                              <optgroup
                                key={unitCategory.key}
                                label={unitCategory.key}
                              >
                                {unitCategory.units.map((unit) => (
                                  <option key={unit} value={unit}>
                                    {unit}
                                  </option>
                                ))}
                              </optgroup>
                            );
                          } else {
                            return Object.entries(unitsByCategory).map(
                              ([category, units]) => (
                                <optgroup key={category} label={category}>
                                  {units.map((unit) => (
                                    <option key={unit} value={unit}>
                                      {unit}
                                    </option>
                                  ))}
                                </optgroup>
                              )
                            );
                          }
                        })()}
                      </select>
                    </td>
                    <td>
                      <button type="button" onClick={() => removeRow(index)}>
                        ✖
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

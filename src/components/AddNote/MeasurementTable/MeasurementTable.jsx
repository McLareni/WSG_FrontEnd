import { useRef, useState } from "react";
import styles from "./MeasurementTable.module.css";
import { getUnitCategory, unitsByCategory } from "../../../utils/units";
import axios from "axios";
import useAuthStore from "../../../store/useAuthStore";
import { useParams } from "react-router-dom";

const URL = import.meta.env.VITE_URL;

const MeasurementTable = ({ measurements, updateMeasuremets }) => {
  const { session } = useAuthStore();
  const params = useParams();

  const [suggestions, setSuggestions] = useState([]);
  const [activeInputIndex, setActiveInputIndex] = useState(null);

  const debounceTimeout = useRef(null);

  const handleChange = (index, field, value) => {
    const updated = [...measurements];
    updated[index][field] =
      field === "type"
        ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        : value;
    updateMeasuremets(updated);

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

  const fetchSuggestions = async (search) => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await axios.get(URL + "getTypeForMeasurements", {
        params: { search, room_id: params.roomId },
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

  const selectSuggestion = (index, suggestion) => {
    const updated = [...measurements];
    updated[index].type = suggestion;
    updateMeasuremets(updated);
    setSuggestions([]);
    setActiveInputIndex(null);
  };

  const removeRow = (index) => {
    const updated = measurements.filter((_, i) => i !== index);
    updateMeasuremets(updated);
  };

  return (
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
                onChange={(e) => handleChange(index, "type", e.target.value)}
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
                      onMouseDown={() => selectSuggestion(index, suggestion)}
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
                onChange={(e) => handleChange(index, "value", e.target.value)}
                placeholder="e.g. 23.4"
                step="any"
              />
            </td>
            <td>
              <select
                value={m.unit}
                onChange={(e) => handleChange(index, "unit", e.target.value)}
              >
                <option value="">Select unit</option>
                {(() => {
                  const unitCategory = getUnitCategory(m?.type);

                  if (unitCategory) {
                    return (
                      <optgroup key={unitCategory.key} label={unitCategory.key}>
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
  );
};

export default MeasurementTable;

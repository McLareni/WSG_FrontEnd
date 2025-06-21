import { useState } from "react";
import ImagePicker from "../UI/ImagePicker/ImagePicker";
import Input from "../UI/Input/Input";
import styles from "./CreateRoomForm.module.css";
import { useTranslation } from "react-i18next";
import { VscAdd } from "react-icons/vsc";
import { FaRegTrashAlt } from "react-icons/fa";
import { createRoomRequest } from "../../utils/roomRequest";
import { validationForm } from "../../utils/createRoomValidation";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const ROOM_TYPES = [
  "informatyka",
  "fizyka",
  "chemia",
  "grafika",
  "wychowanie fizyczne",
  "other",
];

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const CreateRoomForm = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [activeType, setType] = useState("");
  const [places, setPlaces] = useState([]);
  const [schedule, setSchedule] = useState(
    DAYS.map((day) => ({
      day,
      from: "",
      to: "",
      closed: false,
    }))
  );
  const [image, setImage] = useState("");

  const { t } = useTranslation("createRoom");
  const navigate = useNavigate();

  const addPlaceHandler = () => {
    const newPlace = {
      description: "",
      count: 1,
    };
    setPlaces((prevPlaces) => [...prevPlaces, newPlace]);
  };

  const setDescriptionHandler = (index, value) => {
    setPlaces((prevPlaces) =>
      prevPlaces.map((place, i) =>
        i === index ? { ...place, description: value } : place
      )
    );
  };

  const setCountHandler = (index, value) => {
    setPlaces((prevPlaces) =>
      prevPlaces.map((place, i) =>
        i === index ? { ...place, count: value } : place
      )
    );
  };

  const deletePlaceHandler = (index) => {
    console.log(places, index);

    setPlaces((prevPlaces) => prevPlaces.filter((_, i) => i !== index));
  };

  const handleScheduleChange = (index, field, value) => {
    setSchedule((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleClosedChange = (index, checked) => {
    setSchedule((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              closed: checked,
              from: checked ? "" : item.from,
              to: checked ? "" : item.to,
            }
          : item
      )
    );
  };

  const handleFileChange = async () => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      return data.url;
    } catch (error) {
      toast.error(t("errors.uploadPhoto"));
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();

    const roomData = {
      title,
      location,
      description,
      type: activeType,
      places,
      schedule: schedule.filter((item) => !item.closed),
    };

    const error = validationForm(roomData);

    if (error.length) {
      const [baseKey, dayKey] = error[0].split(" ");
      return toast.error(
        `${t(`${baseKey}`)} ${dayKey ? t(`days.${dayKey}`) : ""}`
      );
    }

    if (!image) {
      return toast.error(t("validation.selectPhoto"));
    }
    const url = await handleFileChange();

    if (!url) {
      return;
    }

    roomData.photo_url = url;

    const response = await createRoomRequest(roomData);

    if (response.status === 201) {
      toast.success(t("success"));
      navigate("/");
    }
  };

  return (
    <form className={styles.form} onSubmit={(e) => handleCreateRoom(e)}>
      <div>
        <ImagePicker
          setPhoto={(image) => {
            console.log(image);
            setImage(image);
          }}
        />
        <Input
          label={t("titles.title")}
          labelIsCentered
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
      </div>
      <div>
        <div className={styles.lokalizacja}>
          <Input
            label={t("titles.location")}
            onChange={(e) => setLocation(e.target.value)}
            value={location}
          />
        </div>
        <div className={styles.opis}>
          <Input
            label={t("titles.description")}
            isTextarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </div>
        <div>
          <h2 className="blockTitle">{t("titles.type")}</h2>
          <div className={styles.roomTypeContainer}>
            {ROOM_TYPES.map((type) => (
              <div
                key={type}
                onClick={() => setType(type)}
                className={`${styles.roomType} ${
                  type === activeType ? styles.active : ""
                }`}
              >
                {t(`type.${type}`)}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.placesContainer}>
          <div>
            <h2 className="blockTitle">{t("titles.places")}</h2>
            <button
              type="button"
              className={styles.addPlaceButton}
              onClick={addPlaceHandler}
            >
              {t("table.addPlace")} <VscAdd />
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th className={styles.colNr}>{t("table.number")}</th>
                <th className={styles.colDesc}>{t("table.description")}</th>
                <th className={styles.colCount}>{t("table.count")}</th>
                <th className={styles.colBtn}></th>
              </tr>
            </thead>
            <tbody>
              {places.map((place, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <textarea
                      type="text"
                      value={place.description}
                      onChange={(e) =>
                        setDescriptionHandler(index, e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={place.count}
                      onChange={(e) => setCountHandler(index, e.target.value)}
                      max={20}
                      min={1}
                    />
                  </td>
                  <td>
                    <button
                      className={styles.deletePlaceButton}
                      onClick={() => deletePlaceHandler(index)}
                      type="button"
                    >
                      <FaRegTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.harmonogramContainer}>
          <h2 className="blockTitle">{t("titles.harmonoram")}</h2>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>{t("schedule.from")}</th>
                <th>{t("schedule.to")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((item, index) => (
                <tr key={item.day}>
                  <td>{t(`days.${item.day}`)}:</td>
                  <td>
                    <input
                      type="time"
                      disabled={item.closed}
                      value={item.from}
                      onChange={(e) =>
                        handleScheduleChange(index, "from", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      disabled={item.closed}
                      value={item.to}
                      onChange={(e) =>
                        handleScheduleChange(index, "to", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={item.closed}
                      onChange={(e) =>
                        handleClosedChange(index, e.target.checked)
                      }
                    />
                    <p>{t("blockDay")}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button type="submit" className={styles.createRoomBtn}>
          Stwórz gabinet
        </button>
      </div>
    </form>
  );
};

export default CreateRoomForm;

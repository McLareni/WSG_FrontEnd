// src/components/MyReservation/ReservationTable.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Dropdown from "../UI/Dropdown/Dropdown";
import styles from "./ReservationTable.module.css";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";

const URL = import.meta.env.VITE_URL;

const ReservationTable = () => {
  const { t } = useTranslation("reservationTable");
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [reservations, setReservations] = useState([]);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const { session } = useAuthStore();

  const statusOptions = ["all", "done", "active", "cancelled"];

  const cancelReservation = async (reservationId) => {
    try {
      await axios.post(
        `${URL}cancel-reservation`,
        {
          id: reservationId,
        },
        {
          headers: {
            Authorization: "Bearer " + session.access_token,
          },
        }
      );

      // Оновити список
      setReservations((prev) =>
        prev.map((res) =>
          res.id === reservationId ? { ...res, status: "cancelled" } : res
        )
      );

      setShowCancelPopup(false);
      setSelectedReservation(null);
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
    }
  };

  useEffect(() => {
    async function fetchReservations() {
      const response = await axios.get(
        URL + `getMyResrvation/${session.user.id}`,
        {
          headers: {
            Authorization: "Bearer " + session.access_token,
          },
        }
      );
      setReservations(response.data.updateReservations);
    }

    if (session?.user?.id) {
      fetchReservations();
    }
  }, [session?.user?.id]);

  const filteredData =
    filter === "all"
      ? reservations
      : reservations?.filter((res) => res.status === filter);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t("title")}</h1>

        <div className={styles.dropdownContainer}>
          <Dropdown
            label={<span className={styles.bigLabel}>{t("sortBy")}</span>}
            options={statusOptions.map((key) => t(`statuses.${key}`))}
            selected={t(`statuses.${filter}`)}
            onSelect={(val) => {
              const selectedKey = statusOptions.find(
                (key) => t(`statuses.${key}`) === val
              );
              setFilter(selectedKey);
            }}
            width="278px"
            height="52px"
            className="custom-dropdown"
            textStyle={{ fontSize: "24px" }}
          />
        </div>

        <h2 className={styles.subTitle}>{t("listTitle")}</h2>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>{t("number")}</th>
                <th className={styles.th}>{t("date")}</th>
                <th className={styles.th}>{t("time")}</th>
                <th className={styles.th}>{t("room")}</th>
                {/* <th className={styles.th}>{t("seat")}</th> */}
                <th className={styles.th}>{t("status")}</th>
                <th className={styles.th}>{t("action")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((res, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? styles.evenRow : ""}
                >
                  <td className={styles.td}>{res.id}</td>
                  <td className={styles.td}>{res.date}</td>
                  <td className={styles.td}>
                    {res.start_time.slice(0, 5)} - {res.end_time.slice(0, 5)}
                  </td>
                  <td className={styles.td}>{res.Seats.Rooms.name}</td>
                  {/* <td className={styles.td}>{res.seat}</td> */}
                  <td className={styles.td}>{t(`statuses.${res.status}`)}</td>
                  <td className={styles.td}>
                    {res.status === "active" ? (
                      <button
                        className={`${styles.actionButton} ${styles.cancel}`}
                        onClick={() => {
                          setSelectedReservation(res);
                          setShowCancelPopup(true);
                        }}
                      >
                        {t("cancel")}
                      </button>
                    ) : res.status === "done" ? (
                      <button
                        className={`${styles.actionButton} ${styles.note}`}
                        onClick={() =>
                          navigate(`/add-note/${res.Seats.Rooms.id}/${res.id}`)
                        }
                      >
                        {t("note")}
                      </button>
                    ) : (
                      <span className="text-gray-400">{t("none")}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showCancelPopup && (
          <div className={styles.popupOverlay}>
            <div className={styles.popup}>
              <p>{t("confirmCancel")}</p>
              <div className={styles.popupActions}>
                <button
                  className={styles.confirmBtn}
                  onClick={() => cancelReservation(selectedReservation.id)}
                >
                  {t("yes")}
                </button>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setShowCancelPopup(false)}
                >
                  {t("no")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationTable;

// src/components/MyReservation/ReservationTable.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Dropdown from "../UI/Dropdown/Dropdown";
import styles from "./ReservationTable.module.css";

const reservationData = [
  {
    date: "2025-07-01",
    startTime: "10:00",
    endTime: "12:45",
    room: "B101",
    seat: "P29",
    status: "realized",
  },
  {
    date: "2025-07-01",
    startTime: "12:00",
    endTime: "13:30",
    room: "B101",
    seat: "P23",
    status: "pending",
  },
  {
    date: "2025-07-01",
    startTime: "13:45",
    endTime: "15:00",
    room: "B101",
    seat: "P26",
    status: "realized",
  },
  {
    date: "2025-07-01",
    startTime: "09:00",
    endTime: "10:00",
    room: "B101",
    seat: "P9",
    status: "canceled",
  },
];

const ReservationTable = () => {
  const { t } = useTranslation("reservationTable");
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const statusOptions = ["all", "realized", "pending", "canceled"];

  const filteredData =
    filter === "all"
      ? reservationData
      : reservationData.filter((res) => res.status === filter);

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
                <th className={styles.th}>{t("seat")}</th>
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
                  <td className={styles.td}>{index + 1}</td>
                  <td className={styles.td}>{res.date}</td>
                  <td className={styles.td}>
                    {res.startTime} - {res.endTime}
                  </td>
                  <td className={styles.td}>{res.room}</td>
                  <td className={styles.td}>{res.seat}</td>
                  <td className={styles.td}>{t(`statuses.${res.status}`)}</td>
                  <td className={styles.td}>
                    {res.status === "pending" ? (
                      <button
                        className={`${styles.actionButton} ${styles.cancel}`}
                      >
                        {t("cancel")}
                      </button>
                    ) : res.status === "realized" ? (
                      <button
                        className={`${styles.actionButton} ${styles.note}`}
                        onClick={() => navigate("/notes")}
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
      </div>
    </div>
  );
};

export default ReservationTable;

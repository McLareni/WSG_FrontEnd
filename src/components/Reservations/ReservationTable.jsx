// src/components/Reservations/ReservationTable.jsx
import React, { useState } from "react";
import Dropdown from "../UI/Dropdown/Dropdown";
import styles from "./ReservationTable.module.css";

const reservationData = [
  {
    id: 123,
    date: "2025-07-01",
    time: "10:00",
    room: "B101",
    seat: "P29",
    status: "Zrealizowana",
  },
  {
    id: 123,
    date: "2025-07-01",
    time: "10:00",
    room: "B101",
    seat: "P23",
    status: "Oczekująca",
  },
  {
    id: 123,
    date: "2025-07-01",
    time: "10:00",
    room: "B101",
    seat: "P26",
    status: "Zrealizowana",
  },
  {
    id: 123,
    date: "2025-07-01",
    time: "10:00",
    room: "B101",
    seat: "P9",
    status: "Anulowana",
  },
  {
    id: 123,
    date: "2025-07-01",
    time: "10:00",
    room: "B101",
    seat: "P5",
    status: "Oczekująca",
  },
  {
    id: 123,
    date: "2025-07-01",
    time: "10:00",
    room: "B101",
    seat: "P2",
    status: "Oczekująca",
  },
  {
    id: 123,
    date: "2025-07-01",
    time: "10:00",
    room: "B101",
    seat: "P12",
    status: "Zrealizowana",
  },
  {
    id: 123,
    date: "2025-07-01",
    time: "10:00",
    room: "B101",
    seat: "P15",
    status: "Anulowana",
  },
];

const ReservationTable = () => {
  const [filter, setFilter] = useState("Wszystkie");

  const filteredData =
    filter === "Wszystkie"
      ? reservationData
      : reservationData.filter((res) => res.status === filter);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Moje rezerwacje</h1>

        <div className={styles.dropdownContainer}>
          <Dropdown
            label={
              <span className={styles.bigLabel}>Sortuj według statusu:</span>
            }
            options={["Wszystkie", "Zrealizowana", "Oczekująca", "Anulowana"]}
            selected={filter}
            onSelect={setFilter}
            width="278px"
            height="52px"
            className="custom-dropdown"
            textStyle={{ fontSize: "24px" }}
          />
        </div>

        <h2 className={styles.subTitle}>Lista rezerwacji</h2>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>ID rezerwacji</th>
                <th className={styles.th}>Data</th>
                <th className={styles.th}>Godzina</th>
                <th className={styles.th}>Pokój</th>
                <th className={styles.th}>Miejsce</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Akcja</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((res, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? styles.evenRow : ""}
                >
                  <td className={styles.td}>№{res.id}</td>
                  <td className={styles.td}>{res.date}</td>
                  <td className={styles.td}>{res.time}</td>
                  <td className={styles.td}>{res.room}</td>
                  <td className={styles.td}>{res.seat}</td>
                  <td className={styles.td}>{res.status}</td>
                  <td className={styles.td}>
                    {res.status === "Oczekująca" ? (
                      <button
                        className={`${styles.actionButton} ${styles.cancel}`}
                      >
                        Anuluj rezerwację
                      </button>
                    ) : res.status === "Zrealizowana" ? (
                      <button
                        className={`${styles.actionButton} ${styles.note}`}
                      >
                        Dodaj notatkę
                      </button>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.footerButton}>
          <button className={styles.addBtn}>Dodaj rezerwację +</button>
        </div>
      </div>
    </div>
  );
};

export default ReservationTable;

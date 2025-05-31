// src/components/UI/SearchAndSort/SearchAndSort.jsx
import React, { useState } from "react";
import styles from "./SearchAndSort.module.css";
import Input from "../Input/Input";
import inputStyles from "../Input/Input.projector.module.css";
import Dropdown from "../Dropdown/Dropdown";

const SearchAndSort = () => {
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("Nazwa");
  const [category, setCategory] = useState("Informatyka");

  const sortOptions = ["Nazwa", "Data", "Popularność"];
  const categories = ["Informatyka", "Matematyka", "Fizyka", "Chemia"];

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Wpisz nazwę sali..."
          className={inputStyles.container}
          inputClassName={inputStyles.input}
          style={{ width: "690px", height: "55px" }}
        />
      </div>

      <div className={styles.dropdownsWrapper}>
        <Dropdown
          options={categories}
          selected={category}
          onSelect={setCategory}
          width="242px"
          height="55px"
        />

        <Dropdown
          label="Sort by:"
          options={sortOptions}
          selected={sortBy}
          onSelect={setSortBy}
          width="242px"
          height="55px"
        />
      </div>
    </div>
  );
};

export default SearchAndSort;

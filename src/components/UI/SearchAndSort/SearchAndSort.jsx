// src/components/UI/SearchAndSort/SearchAndSort.jsx
import React, { useState } from "react";
import styles from "./SearchAndSort.module.css";
import InputV2 from "../Input.v2/Input.v2";
import { VscChevronDown } from "react-icons/vsc";

const SearchAndSort = () => {
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("Nazwa");
  const [category, setCategory] = useState("Informatyka");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const sortOptions = ["Nazwa", "Data", "Popularność"];
  const categories = ["Informatyka", "Matematyka", "Fizyka", "Chemia"];

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <InputV2
          value={searchValue}
          onChange={setSearchValue}
          placeholder="Wpisz nazwę sali..."
          width="400px"
        />
      </div>

      <div className={styles.dropdownsWrapper}>
        <div className={styles.dropdownContainer}>
          <span className={styles.label}>Sort by:</span>
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownButton}
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsCategoryOpen(false);
              }}
            >
              {sortBy}
              <span className={styles.arrow}>
                {isSortOpen ? <VscChevronDown /> : <VscChevronDown />}
              </span>
            </button>
            {isSortOpen && (
              <div className={styles.dropdownMenu}>
                {sortOptions.map((option) => (
                  <div
                    key={option}
                    className={styles.menuItem}
                    onClick={() => {
                      setSortBy(option);
                      setIsSortOpen(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.dropdownContainer}>
          <span className={styles.label}>Kategoria:</span>
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownButton}
              onClick={() => {
                setIsCategoryOpen(!isCategoryOpen);
                setIsSortOpen(false);
              }}
            >
              {category}
              <span className={styles.arrow}>
                {isCategoryOpen ? <VscChevronDown /> : <VscChevronDown />}
              </span>
            </button>
            {isCategoryOpen && (
              <div className={styles.dropdownMenu}>
                {categories.map((item) => (
                  <div
                    key={item}
                    className={styles.menuItem}
                    onClick={() => {
                      setCategory(item);
                      setIsCategoryOpen(false);
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAndSort;

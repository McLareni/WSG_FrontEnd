import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./SearchAndSort.module.css";
import Input from "../Input/Input";
import inputStyles from "../Input/Input.projector.module.css";
import Dropdown from "../Dropdown/Dropdown";

const SearchAndSort = ({ changeCategory, changeSortBy, changeSearchValue }) => {
  const { t } = useTranslation("homePage");

  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [category, setCategory] = useState("all");

  const sortOptions = ["name", "teacher", "date"];
  const categories = [
    "all",
    "informatyka",
    "fizyka",
    "chemia",
    "grafika",
    "wychowanie fizyczne",
    "other",
  ];

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <Input
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            changeSearchValue(e.target.value);
          }}
          placeholder={t("placeholder")}
          // label={t("searchAndSort.searchPlaceholder")}
          className={inputStyles.container}
          inputClassName={inputStyles.input}
          style={{ width: "690px", height: "55px" }}
        />
      </div>

      <div className={styles.dropdownsWrapper}>
        <Dropdown
          options={categories.map((key) => t(`categories.${key}`))}
          selected={t(`categories.${category}`)}
          onSelect={(val) => {
            setCategory(
              categories[
                categories.map((k) => t(`categories.${k}`)).indexOf(val)
              ]
            );
            changeCategory(
              categories[
                categories.map((k) => t(`categories.${k}`)).indexOf(val)
              ]
            );
          }}
          width="242px"
          height="55px"
        />

        <Dropdown
          label={t("sortByLabel")}
          options={sortOptions.map((key) => t(`sortOptions.${key}`))}
          selected={t(`sortOptions.${sortBy}`)}
          onSelect={(val) => {
            setSortBy(
              sortOptions[
                sortOptions.map((k) => t(`sortOptions.${k}`)).indexOf(val)
              ]
            );
            changeSortBy(
              sortOptions[
                sortOptions.map((k) => t(`sortOptions.${k}`)).indexOf(val)
              ]
            );
          }}
          width="242px"
          height="55px"
        />
      </div>
    </div>
  );
};

export default SearchAndSort;

'use client'

import React, { FC } from "react";
import styles from "./dropdown.module.css";
import clsx from "clsx";

type Props = {
  name: string;
  label: string;
  value: string;
  setValue: (value: string) => void;
};

export const Dropdown: FC<Props> = ({ name, label, value, setValue }) => {
  return (
    <div className={styles.dropdown}>
      <label htmlFor="businessField">{label}</label>
      <select
        className={clsx(styles.select, !value && styles.placeholder)}
        name="businessField"
        id="businessField"
        onChange={(e) => setValue(e.target.value)}
      >
        <option className={styles.placeholder} value="">
          --Select--
        </option>
        <option value="firstOption">First Option</option>
        <option value="secondOption">Second Option</option>
        <option value="thirdOption">Third Option</option>
        <option value="fourthOption">Fourth Option</option>
      </select>
    </div>
  );
};

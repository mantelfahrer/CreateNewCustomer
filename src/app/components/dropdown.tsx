"use client";

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
        <option value="insurance">Insurance</option>
        <option value="banking">Banking</option>
        <option value="automotiveTransportation">
          Automotive & Transportation
        </option>
        <option value="retail">Retail</option>
        <option value="lifeSciences">Life Sciences</option>
        <option value="manufacturingIndustry">Manufacturing Industry</option>
        <option value="dataAnalytics">Data & Analytics</option>
        <option value="digitalExperience">Digital Experience</option>
        <option value="microsoft">Microsoft</option>
        <option value="lottery">Lottery</option>
        <option value="sports">Sports</option>
        <option value="health">Health</option>
        <option value="financeControlling">Finance & Controlling</option>
      </select>
    </div>
  );
};

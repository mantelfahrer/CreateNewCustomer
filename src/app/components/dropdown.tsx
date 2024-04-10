"use client";

import React, { FC } from "react";
import styles from "./dropdown.module.css";
import clsx from "clsx";

type Props = {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export const Dropdown: FC<Props> = ({ name, label, value, onChange }) => {
  return (
    <div className={styles.dropdown}>
      <label htmlFor={name}>{label}</label>
      <select
        className={clsx(styles.select, !value && styles.placeholder)}
        name={name}
        id={name}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        required
      >
        <option className={styles.placeholder} value="">
          --Select--
        </option>
        <option value="Insurance">Insurance</option>
        <option value="Banking">Banking</option>
        <option value="Automotive & Transportation">
          Automotive & Transportation
        </option>
        <option value="Retail">Retail</option>
        <option value="Life Sciences">Life Sciences</option>
        <option value="Manufacturing Industry">Manufacturing Industry</option>
        <option value="Data & Analytics">Data & Analytics</option>
        <option value="Digital Experience">Digital Experience</option>
        <option value="Microsoft">Microsoft</option>
        <option value="Lottery">Lottery</option>
        <option value="Sports">Sports</option>
        <option value="Health">Health</option>
        <option value="Finance & Controlling">Finance & Controlling</option>
      </select>
    </div>
  );
};

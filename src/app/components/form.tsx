"use client";

import { useState } from "react";
import { Button } from "./button";
import { Dropdown } from "./dropdown";
import styles from "./form.module.css";

export const Form = () => {
  const [businessField, setBusinessField] = useState<string>("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(businessField);
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <Dropdown
        name="businessField"
        label="Business Field:"
        value={businessField}
        setValue={setBusinessField}
      />
      <Button text="Create new customer" />
      <p className={styles.errorText}>Error Text</p>
    </form>
  );
};

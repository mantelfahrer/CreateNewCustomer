import React, { FC } from "react";
import styles from "./button.module.css";
import clsx from "clsx";

type Props = {
  text: string;
  disabled?: boolean;
};

export const Button: FC<Props> = ({ text, disabled }) => {
  return (
    <button type="submit" disabled={disabled}>
      {text}
    </button>
  );
};

"use client";

import { FC, useEffect, useState } from "react";
import { FaRegClipboard } from "react-icons/fa";
import styles from "./copyToClipboardButton.module.css";

type Props = {
  value: string;
};

export const CopyToClipboardButton: FC<Props> = ({ value }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 5000);
    }
  }, [copied]);

  return (
    <div className={styles.copyToClipboard}>
      <button
        className={styles.copyToClipboardButton}
        onClick={() => copyToClipboard(value)}
      >
        <FaRegClipboard />
      </button>
      {copied && (
        <p className={styles.copyToClipboardText}>Copied to clipboard.</p>
      )}
    </div>
  );
};

import { Customer } from "@/models/Customer";
import { parseString } from "@/utils/parseString";
import { FC } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { CopyToClipboardButton } from "./copyToClipboardButton";
import styles from "./result.module.css";
import clsx from "clsx";

type Props = {
  activeCustomer: Customer;
  type: "overview" | "uiUx" | "featureList" | "pagesTree";
  title: string;
  open: boolean;
  setOpen: (value: boolean) => void;
};

export const Result: FC<Props> = ({
  activeCustomer,
  type,
  title,
  open,
  setOpen,
}) => {
  return (
    <div className={styles.result}>
      <div onClick={() => setOpen(!open)} className={styles.resultAccordion}>
        {open ? <FaChevronDown /> : <FaChevronRight />}
        <h2 className={styles.resultTitle}>{title}</h2>
      </div>

      <div
        className={clsx(
          styles.resultContentWrapper,
          open && styles.resultContentWrapperOpen
        )}
      >
        <div className={styles.resultContent}>
          {parseString(activeCustomer[type].data!.generations[0].text).map(
            (string, index) => {
              return (
                <div key={index}>
                  <p>{string}</p>
                  <b />
                </div>
              );
            }
          )}
          {/* BUTTON TO COPY TO CLIPBOARD */}
          {!!activeCustomer[type].data && (
            <CopyToClipboardButton
              value={activeCustomer[type].data!.generations[0].text}
            />
          )}
        </div>
      </div>
    </div>
  );
};

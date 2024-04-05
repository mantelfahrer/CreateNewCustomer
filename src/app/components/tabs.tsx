"use client";
import {
  ADD_CUSTOMER,
  CHANGE_ACTIVE_CUSTOMER,
} from "@/lib/features/customers/customersSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import clsx from "clsx";
import styles from "./tabs.module.css";

export const Tabs = () => {
  const customers = useAppSelector((state) => state.customers);
  const dispatch = useAppDispatch();

  const handleClickTab = (value: string) => {
    dispatch(CHANGE_ACTIVE_CUSTOMER(value));
  };

  const handleClickNewTab = () => {
    dispatch(ADD_CUSTOMER());
  };

  return (
    <div className={styles.tabs}>
      {customers.customers.map((customer, index) => {
        return (
          <div
            key={customer.id}
            className={clsx(
              styles.tab,
              customers.activeCustomer !== customer.id && styles.tabInactive
            )}
            onClick={() => handleClickTab(customer.id)}
          >
            {`Customer #${index + 1}`}
          </div>
        );
      })}
      <div className={styles.tabNew} onClick={handleClickNewTab}>
        +
      </div>
    </div>
  );
};

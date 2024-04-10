"use client";

import {
  useGenerateTextMutation,
  useGetResultQuery,
} from "@/lib/features/api/apiSlice";
import {
  CHANGE_BUSINESS_FIELD,
  RESET_CUSTOMER,
} from "@/lib/features/customers/customersSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { generatePrompt } from "@/utils/generatePrompt";
import { parseString } from "@/utils/parseString";
import { useState } from "react";
import { Button } from "./button";
import { Dropdown } from "./dropdown";
import styles from "./form.module.css";
import { Loader } from "./loader";

export const Form = () => {
  const [waitTimer, setWaitTimer] = useState<number | undefined>(undefined);
  const [generateText, { error, isLoading }] = useGenerateTextMutation();
  const activeCustomer = useAppSelector(
    (state) => state.customers.activeCustomer
  );
  const dispatch = useAppDispatch();
  const { data: queryData } = useGetResultQuery(activeCustomer.idApi!, {
    pollingInterval: 5000,
    skip: !activeCustomer.requestPending || !activeCustomer.idApi,
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const prompt = generatePrompt(activeCustomer.businessField);
    generateText({
      prompt,
      params: {
        max_length: 500,
        frmttriminc: true,
      },
      models: ["aphrodite/ANNE-EXP-16_8::DrFumes#253596"],
    });
  };

  const handleChange = (value: string) => {
    dispatch(CHANGE_BUSINESS_FIELD({ value, id: activeCustomer.id }));
  };

  const handleResetData = () => {
    dispatch(RESET_CUSTOMER(activeCustomer));
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {!activeCustomer.generatedData?.done &&
        !activeCustomer.requestPending && (
          <>
            <Dropdown
              name="businessField"
              label="Business Field:"
              value={activeCustomer.businessField}
              onChange={handleChange}
            />
            <Button
              text="Create new customer"
              disabled={activeCustomer.requestPending || isLoading}
            />
          </>
        )}
      {activeCustomer.generatedData?.done &&
        !isLoading &&
        !activeCustomer.requestPending && (
          <>
            <div className={styles.buttonRow}>
              <button type="submit" className={styles.buttonSmall}>
                Create New Data
              </button>
              <div onClick={handleResetData} className={styles.buttonSmall}>
                Reset Data
              </div>
            </div>

            <h1
              className={styles.result}
            >{`Business field: ${activeCustomer.businessField}`}</h1>
            {activeCustomer.generatedData.generations.map(
              (generation, index) => {
                return (
                  <div key={index} className={styles.result}>
                    {parseString(generation.text).map((string) => {
                      return (
                        <>
                          <p>{string}</p>
                          <b />
                        </>
                      );
                    })}
                  </div>
                );
              }
            )}
          </>
        )}

      {(activeCustomer.requestPending || isLoading) && <Loader />}
      {!!activeCustomer.generatedData?.wait_time && (
        <p className={styles.waitTime}>
          {`Approximately remaining: ${activeCustomer.generatedData.wait_time} seconds`}
        </p>
      )}
      {(error || activeCustomer.requestError) && (
        <p
          className={styles.errorText}
        >{`Whoops, an error occurred, please try again.`}</p>
      )}
    </form>
  );
};

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
import clsx from "clsx";
import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight, FaRegClipboard } from "react-icons/fa";
import { Button } from "./button";
import { Dropdown } from "./dropdown";
import styles from "./form.module.css";
import { Loader } from "./loader";
import { CopyToClipboardButton } from "./copyToClipboardButton";

export const Form = () => {
  const [overviewOpen, setOverviewOpen] = useState<boolean>(true);
  const [generateText, { error, isLoading }] = useGenerateTextMutation();
  const activeCustomer = useAppSelector(
    (state) => state.customers.activeCustomer
  );
  const dispatch = useAppDispatch();
  const { data: queryData } = useGetResultQuery(activeCustomer.idApi!, {
    pollingInterval: 5000,
    skip: !activeCustomer.requestPending || !activeCustomer.idApi,
  });

  const onSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const prompt = generatePrompt(activeCustomer.businessField);
    generateText({
      prompt,
      params: {
        max_length: 500,
        frmttriminc: true,
      },
      // models: ["aphrodite/ANNE-EXP-16_8::DrFumes#253596"],
    });
  };

  const handleChange = (value: string) => {
    dispatch(CHANGE_BUSINESS_FIELD({ value, id: activeCustomer.id }));
  };

  const handleResetData = () => {
    dispatch(RESET_CUSTOMER(activeCustomer));
  };

  return (
    <>
      {/* FORM */}
      <form className={styles.main} onSubmit={onSubmit}>
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
      </form>

      {/* EVERYTHING ELSE */}
      <div className={styles.main}>
        {/* DISPLAY IF THERE IS GENERATED DATA */}
        {activeCustomer.generatedData?.done &&
          !isLoading &&
          !activeCustomer.requestPending && (
            <>
              {/* MANAGE GENERATED DATA */}
              <div className={styles.buttonRow}>
                <button
                  onClick={() => onSubmit()}
                  className={styles.buttonSmall}
                >
                  Create New Data
                </button>
                <button
                  onClick={handleResetData}
                  className={styles.buttonSmall}
                >
                  Reset Data
                </button>
              </div>

              {/* TITLE */}
              <h1
                className={styles.title}
              >{`Business field: ${activeCustomer.businessField}`}</h1>

              {/* GENERATED DATA: OVERVIEW */}
              <div className={styles.result}>
                <div
                  onClick={() => setOverviewOpen(!overviewOpen)}
                  className={styles.resultAccordion}
                >
                  {overviewOpen ? <FaChevronDown /> : <FaChevronRight />}
                  <h2 className={styles.resultTitle}>Overview</h2>
                </div>

                <div
                  className={clsx(
                    styles.resultContentWrapper,
                    overviewOpen && styles.resultContentWrapperOpen
                  )}
                >
                  <div className={styles.resultContent}>
                    {parseString(
                      activeCustomer.generatedData.generations[0].text
                    ).map((string, index) => {
                      return (
                        <div key={index}>
                          <p>{string}</p>
                          <b />
                        </div>
                      );
                    })}
                    {/* BUTTON TO COPY TO CLIPBOARD */}
                    {!!activeCustomer.generatedData && (
                      <CopyToClipboardButton
                        value={activeCustomer.generatedData.generations[0].text}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* BUTTONS TO CREATE ADDITIONAL DATA */}
              <div className={clsx(styles.buttonRow, styles.buttonRowBottom)}>
                <button
                  onClick={handleResetData}
                  className={styles.buttonSmall}
                >
                  UI/UX Requirements
                </button>
                <button
                  onClick={handleResetData}
                  className={styles.buttonSmall}
                >
                  Pages and subpages Tree
                </button>
                <button
                  onClick={handleResetData}
                  className={styles.buttonSmall}
                >
                  List of features
                </button>
              </div>
            </>
          )}

        {/* LOADER */}
        {(activeCustomer.requestPending || isLoading) && <Loader />}

        {/* DISPLAY WAIT TIME */}
        {!!activeCustomer.generatedData?.wait_time && (
          <p className={styles.waitTime}>
            {`Approximately remaining: ${activeCustomer.generatedData.wait_time} seconds`}
          </p>
        )}

        {/* DISPLAY ERROR */}
        {(error || activeCustomer.requestError) && (
          <p
            className={styles.errorText}
          >{`Whoops, an error occurred, please try again.`}</p>
        )}
      </div>
    </>
  );
};

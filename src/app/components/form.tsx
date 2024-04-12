"use client";

import {
  useGenerateFeatureListMutation,
  useGeneratePagesTreeMutation,
  useGenerateTextMutation,
  useGenerateUiUxRequirementsMutation,
  useGetFeatureListResultQuery,
  useGetPagesTreeResultQuery,
  useGetResultQuery,
  useGetUiUxRequirementsResultQuery,
} from "@/lib/features/api/apiSlice";
import {
  CHANGE_BUSINESS_FIELD,
  RESET_CUSTOMER,
} from "@/lib/features/customers/customersSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { generatePrompt } from "@/utils/generatePrompt";
import clsx from "clsx";
import { useState } from "react";
import { Button } from "./button";
import { Dropdown } from "./dropdown";
import styles from "./form.module.css";
import { Loader } from "./loader";
import { Result } from "./result";

export const Form = () => {
  // LOCAL STATE
  const [overviewOpen, setOverviewOpen] = useState<boolean>(true);
  const [uiUxOpen, setUiUxOpen] = useState<boolean>(true);
  const [featureListOpen, setFeatureListOpen] = useState<boolean>(true);
  const [pagesTreeOpen, setPagesTreeOpen] = useState<boolean>(true);

  // RTK (QUERY)
  const dispatch = useAppDispatch();
  const [generateText, { error, isLoading }] = useGenerateTextMutation();
  const [
    generateUiUxRequirements,
    { error: uiUxError, isLoading: uiUxLoading },
  ] = useGenerateUiUxRequirementsMutation();
  const [
    generateFeatureList,
    { error: featureListError, isLoading: featureListLoading },
  ] = useGenerateFeatureListMutation();
  const [
    generatePagesTree,
    { error: pagesTreeError, isLoading: pagesTreeLoading },
  ] = useGeneratePagesTreeMutation();
  const activeCustomer = useAppSelector(
    (state) => state.customers.activeCustomer
  );

  // OVERVIEW DATA
  // polling
  const { data: overviewData } = useGetResultQuery(
    activeCustomer.overview.idApi!,
    {
      pollingInterval: 5000,
      skip: !activeCustomer.overview.pending || !activeCustomer.overview.idApi,
    }
  );
  // initial request
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

  // UI/UX
  // polling
  const { data: uiUxData } = useGetUiUxRequirementsResultQuery(
    activeCustomer.uiUx.idApi!,
    {
      pollingInterval: 5000,
      skip: !activeCustomer.uiUx.pending || !activeCustomer.uiUx.idApi,
    }
  );
  // initial request
  const handleCreateUiUxRequirements = () => {
    const prompt = generatePrompt(
      activeCustomer.businessField,
      [activeCustomer.overview.data!.generations[0].text],
      "These are the UI and UX Requirements for the web app:"
    );
    generateUiUxRequirements({
      prompt,
      params: {
        max_length: 500,
        frmttriminc: true,
      },
    });
  };

  // FEATURE LIST
  // polling
  const { data: featureListData } = useGetFeatureListResultQuery(
    activeCustomer.featureList.idApi!,
    {
      pollingInterval: 5000,
      skip:
        !activeCustomer.featureList.pending ||
        !activeCustomer.featureList.idApi,
    }
  );
  // initial request
  const handleCreateFeatureList = () => {
    const prompt = generatePrompt(
      activeCustomer.businessField,
      [activeCustomer.overview.data!.generations[0].text],
      "Following is a short list of features that the web app should include:"
    );
    generateFeatureList({
      prompt,
      params: {
        max_length: 500,
        frmttriminc: true,
      },
    });
  };
  // PAGES TREE
  // polling
  const { data: pagesTreeData } = useGetPagesTreeResultQuery(
    activeCustomer.pagesTree.idApi!,
    {
      pollingInterval: 5000,
      skip:
        !activeCustomer.pagesTree.pending || !activeCustomer.pagesTree.idApi,
    }
  );
  // initial request
  const handleCreatePagesTree = () => {
    const prompt = generatePrompt(
      activeCustomer.businessField,
      [activeCustomer.overview.data!.generations[0].text],
      "Following is a hierarchical tree of pages and subpages for the web app:"
    );
    generatePagesTree({
      prompt,
      params: {
        max_length: 500,
        frmttriminc: true,
      },
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
        {!activeCustomer.overview.data?.done &&
          !activeCustomer.overview.pending &&
          !isLoading && (
            <>
              <Dropdown
                name="businessField"
                label="Business Field:"
                value={activeCustomer.businessField}
                onChange={handleChange}
              />
              <Button
                text="Create new customer"
                disabled={activeCustomer.overview.pending || isLoading}
              />
            </>
          )}
      </form>

      {/* EVERYTHING ELSE */}
      <div className={styles.main}>
        {/* DISPLAY IF THERE IS GENERATED DATA */}
        {activeCustomer.overview.data?.done &&
          !isLoading &&
          !activeCustomer.overview.pending && (
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
              <Result
                activeCustomer={activeCustomer}
                type="overview"
                title="Overview"
                open={overviewOpen}
                setOpen={setOverviewOpen}
              />

              {/* GENERATED DATA: UI/UX */}
              {activeCustomer.uiUx.data?.done &&
                !uiUxLoading &&
                !activeCustomer.uiUx.pending && (
                  <Result
                    activeCustomer={activeCustomer}
                    type="uiUx"
                    title="UI / UX"
                    open={uiUxOpen}
                    setOpen={setUiUxOpen}
                  />
                )}

              {/* GENERATED DATA: FEATURE LIST */}
              {activeCustomer.featureList.data?.done &&
                !featureListLoading &&
                !activeCustomer.featureList.pending && (
                  <Result
                    activeCustomer={activeCustomer}
                    type="featureList"
                    title="Feature List"
                    open={featureListOpen}
                    setOpen={setFeatureListOpen}
                  />
                )}

              {/* GENERATED DATA: PAGES TREE */}
              {activeCustomer.pagesTree.data?.done &&
                !pagesTreeLoading &&
                !activeCustomer.pagesTree.pending && (
                  <Result
                    activeCustomer={activeCustomer}
                    type="pagesTree"
                    title="Pages and Subpages"
                    open={pagesTreeOpen}
                    setOpen={setPagesTreeOpen}
                  />
                )}

              {/* BUTTONS TO CREATE ADDITIONAL DATA */}
              {!activeCustomer.overview.pending &&
                !activeCustomer.uiUx.pending &&
                !activeCustomer.featureList.pending &&
                !activeCustomer.pagesTree.pending &&
                !isLoading &&
                !uiUxLoading &&
                !featureListLoading &&
                !pagesTreeLoading && (
                  <div
                    className={clsx(styles.buttonRow, styles.buttonRowBottom)}
                  >
                    {!activeCustomer.uiUx.data &&
                      !activeCustomer.uiUx.pending && (
                        <button
                          onClick={handleCreateUiUxRequirements}
                          className={styles.buttonSmall}
                        >
                          UI/UX Requirements
                        </button>
                      )}
                    {!activeCustomer.featureList.data &&
                      !activeCustomer.featureList.pending && (
                        <button
                          onClick={handleCreateFeatureList}
                          className={styles.buttonSmall}
                        >
                          List of features
                        </button>
                      )}
                    {!activeCustomer.pagesTree.data &&
                      !activeCustomer.pagesTree.pending && (
                        <button
                          onClick={handleCreatePagesTree}
                          className={styles.buttonSmall}
                        >
                          Pages and subpages Tree
                        </button>
                      )}
                  </div>
                )}
            </>
          )}

        {/* LOADER */}
        {(activeCustomer.overview.pending ||
          activeCustomer.uiUx.pending ||
          activeCustomer.featureList.pending ||
          activeCustomer.pagesTree.pending ||
          isLoading ||
          uiUxLoading ||
          featureListLoading ||
          pagesTreeLoading) && (
          <div className={styles.loaderRow}>
            <Loader />
            {/* DISPLAY WAIT TIME */}
            {!!activeCustomer.overview.data?.wait_time && (
              <p className={styles.waitTime}>
                {`Approximately remaining: ${activeCustomer.overview.data.wait_time} seconds`}
              </p>
            )}
            {!!activeCustomer.uiUx.data?.wait_time && (
              <p className={styles.waitTime}>
                {`Approximately remaining: ${activeCustomer.uiUx.data.wait_time} seconds`}
              </p>
            )}
            {!!activeCustomer.featureList.data?.wait_time && (
              <p className={styles.waitTime}>
                {`Approximately remaining: ${activeCustomer.featureList.data.wait_time} seconds`}
              </p>
            )}
            {!!activeCustomer.pagesTree.data?.wait_time && (
              <p className={styles.waitTime}>
                {`Approximately remaining: ${activeCustomer.pagesTree.data.wait_time} seconds`}
              </p>
            )}
          </div>
        )}

        {/* DISPLAY ERROR */}
        {(activeCustomer.overview.error ||
          activeCustomer.uiUx.error ||
          activeCustomer.featureList.error ||
          activeCustomer.pagesTree.error ||
          error ||
          uiUxError ||
          featureListError ||
          pagesTreeError) && (
          <p
            className={styles.errorText}
          >{`Whoops, an error occurred, please try again.`}</p>
        )}
      </div>
    </>
  );
};

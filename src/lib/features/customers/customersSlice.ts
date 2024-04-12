import { Customer, createInitialCustomerData } from "@/models/Customer";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { hordeApi } from "../api/apiSlice";
import { RequestAsync, RequestStatusKobold } from "@/models/hordeModels";

export interface CustomersState {
  customers: Customer[];
  activeCustomer: Customer;
}

const uuid = uuidv4();
const initialCustomer: Customer = createInitialCustomerData(uuid);

const initialState: CustomersState = {
  customers: [initialCustomer],
  activeCustomer: initialCustomer,
};

const reactToRequests = (
  forInfo: "overview" | "uiUx" | "featureList" | "pagesTree",
  typeOfAction:
    | "requestGeneration"
    | "requestGenerationSuccessful"
    | "requestResultsError"
    | "requestResultsSuccessful",
  customers: Customer[],
  activeCustomer: Customer,
  payload?: RequestAsync | RequestStatusKobold
) => {
  switch (typeOfAction) {
    case "requestGeneration":
      customers.forEach((customer) => {
        if (customer.id === activeCustomer.id) {
          customer[forInfo].error = false;
          customer[forInfo].data = undefined;
          customer[forInfo].idApi = undefined;
          activeCustomer[forInfo].error = false;
          activeCustomer[forInfo].data = undefined;
          activeCustomer[forInfo].idApi = undefined;

          if (forInfo === "overview") {
            customer.uiUx.error = false;
            customer.uiUx.data = undefined;
            customer.uiUx.idApi = undefined;
            customer.featureList.error = false;
            customer.featureList.data = undefined;
            customer.featureList.idApi = undefined;
            customer.pagesTree.error = false;
            customer.pagesTree.data = undefined;
            customer.pagesTree.idApi = undefined;
            activeCustomer.uiUx.error = false;
            activeCustomer.uiUx.data = undefined;
            activeCustomer.uiUx.idApi = undefined;
            activeCustomer.featureList.error = false;
            activeCustomer.featureList.data = undefined;
            activeCustomer.featureList.idApi = undefined;
            activeCustomer.pagesTree.error = false;
            activeCustomer.pagesTree.data = undefined;
            activeCustomer.pagesTree.idApi = undefined;
          }
        }
      });
      break;
    case "requestGenerationSuccessful":
      if (!!payload && "id" in payload) {
        customers.forEach((customer) => {
          if (customer.id === activeCustomer.id) {
            customer[forInfo].idApi = payload.id;
            customer[forInfo].pending = true;
            activeCustomer[forInfo].idApi = payload.id;
            activeCustomer[forInfo].pending = true;
          }
        });
      }

      break;
    case "requestResultsError":
      customers.forEach((customer) => {
        if (customer.id === activeCustomer.id) {
          customer[forInfo].pending = false;
          customer[forInfo].error = true;
          activeCustomer[forInfo].pending = false;
          activeCustomer[forInfo].error = true;
        }
      });
      break;
    case "requestResultsSuccessful":
      if (
        !!payload &&
        "done" in payload &&
        "faulted" in payload &&
        "is_possible" in payload
      ) {
        customers.forEach((customer) => {
          if (customer.id === activeCustomer.id) {
            customer[forInfo].data = payload;
            activeCustomer[forInfo].data = payload;
            if (payload.done) {
              customer[forInfo].pending = false;
              customer[forInfo].error = false;
              activeCustomer[forInfo].pending = false;
              activeCustomer[forInfo].error = false;
            }
            if (payload.faulted || !payload.is_possible) {
              customer[forInfo].pending = false;
              customer[forInfo].error = true;
              activeCustomer[forInfo].pending = false;
              activeCustomer[forInfo].error = true;
            }
          }
        });
      }
      break;
    default:
      console.log(
        "No matching type of action provided. Could not make changes to the store."
      );
  }
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    ADD_CUSTOMER: (state) => {
      const newUuid = uuidv4();
      const newCustomer: Customer = createInitialCustomerData(newUuid);
      state.customers.push(newCustomer);
      state.activeCustomer = newCustomer;
    },
    RESET_CUSTOMER: (state, action: PayloadAction<Customer>) => {
      state.customers.forEach((customer) => {
        if (customer.id === action.payload.id) {
          customer.businessField = "";
          customer.overview = {
            data: undefined,
            pending: false,
            error: false,
          };
          customer.uiUx = {
            data: undefined,
            pending: false,
            error: false,
          };
          customer.featureList = {
            data: undefined,
            pending: false,
            error: false,
          };
          customer.pagesTree = {
            data: undefined,
            pending: false,
            error: false,
          };
          state.activeCustomer = customer;
        }
      });
    },
    CHANGE_BUSINESS_FIELD: (
      state,
      action: PayloadAction<{ value: string; id: string }>
    ) => {
      state.customers.forEach((customer) => {
        if (customer.id === action.payload.id) {
          customer.businessField = action.payload.value;
          state.activeCustomer = customer;
        }
      });
    },
    CHANGE_ACTIVE_CUSTOMER: (state, action: PayloadAction<Customer>) => {
      state.activeCustomer = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // OVERVIEW
      // when starting request to generate text
      .addMatcher(hordeApi.endpoints.generateText.matchPending, (state) => {
        reactToRequests(
          "overview",
          "requestGeneration",
          state.customers,
          state.activeCustomer
        );
      })
      // request to generate text was successful
      .addMatcher(
        hordeApi.endpoints.generateText.matchFulfilled,
        (state, action) => {
          reactToRequests(
            "overview",
            "requestGenerationSuccessful",
            state.customers,
            state.activeCustomer,
            action.payload
          );
        }
      )
      // request to check results for generated text returned an error
      .addMatcher(hordeApi.endpoints.getResult.matchRejected, (state) => {
        reactToRequests(
          "overview",
          "requestResultsError",
          state.customers,
          state.activeCustomer
        );
      })
      // request to check results for generated text returned successfully
      .addMatcher(
        hordeApi.endpoints.getResult.matchFulfilled,
        (state, action) => {
          reactToRequests(
            "overview",
            "requestResultsSuccessful",
            state.customers,
            state.activeCustomer,
            action.payload
          );
        }
      )
      // ADDITIONAL PROMPTS
      // UI UX
      // when starting request to generate text
      .addMatcher(
        hordeApi.endpoints.generateUiUxRequirements.matchPending,
        (state) => {
          reactToRequests(
            "uiUx",
            "requestGeneration",
            state.customers,
            state.activeCustomer
          );
        }
      )
      // request to generate text was successful
      .addMatcher(
        hordeApi.endpoints.generateUiUxRequirements.matchFulfilled,
        (state, action) => {
          reactToRequests(
            "uiUx",
            "requestGenerationSuccessful",
            state.customers,
            state.activeCustomer,
            action.payload
          );
        }
      )
      // request to check results for generated text returned an error
      .addMatcher(
        hordeApi.endpoints.getUiUxRequirementsResult.matchRejected,
        (state) => {
          reactToRequests(
            "uiUx",
            "requestResultsError",
            state.customers,
            state.activeCustomer
          );
        }
      )
      // request to check results for generated text returned successfully
      .addMatcher(
        hordeApi.endpoints.getUiUxRequirementsResult.matchFulfilled,
        (state, action) => {
          reactToRequests(
            "uiUx",
            "requestResultsSuccessful",
            state.customers,
            state.activeCustomer,
            action.payload
          );
        }
      )
      // FEATURE LIST
      // when starting request to generate text
      .addMatcher(
        hordeApi.endpoints.generateFeatureList.matchPending,
        (state) => {
          reactToRequests(
            "featureList",
            "requestGeneration",
            state.customers,
            state.activeCustomer
          );
        }
      )
      // request to generate text was successful
      .addMatcher(
        hordeApi.endpoints.generateFeatureList.matchFulfilled,
        (state, action) => {
          reactToRequests(
            "featureList",
            "requestGenerationSuccessful",
            state.customers,
            state.activeCustomer,
            action.payload
          );
        }
      )
      // request to check results for generated text returned an error
      .addMatcher(
        hordeApi.endpoints.getFeatureListResult.matchRejected,
        (state) => {
          reactToRequests(
            "featureList",
            "requestResultsError",
            state.customers,
            state.activeCustomer
          );
        }
      )
      // request to check results for generated text returned successfully
      .addMatcher(
        hordeApi.endpoints.getFeatureListResult.matchFulfilled,
        (state, action) => {
          reactToRequests(
            "featureList",
            "requestResultsSuccessful",
            state.customers,
            state.activeCustomer,
            action.payload
          );
        }
      )
      // PAGES TREE
      // when starting request to generate text
      .addMatcher(
        hordeApi.endpoints.generatePagesTree.matchPending,
        (state) => {
          reactToRequests(
            "pagesTree",
            "requestGeneration",
            state.customers,
            state.activeCustomer
          );
        }
      )
      // request to generate text was successful
      .addMatcher(
        hordeApi.endpoints.generatePagesTree.matchFulfilled,
        (state, action) => {
          reactToRequests(
            "pagesTree",
            "requestGenerationSuccessful",
            state.customers,
            state.activeCustomer,
            action.payload
          );
        }
      )
      // request to check results for generated text returned an error
      .addMatcher(
        hordeApi.endpoints.getPagesTreeResult.matchRejected,
        (state) => {
          reactToRequests(
            "pagesTree",
            "requestResultsError",
            state.customers,
            state.activeCustomer
          );
        }
      )
      // request to check results for generated text returned successfully
      .addMatcher(
        hordeApi.endpoints.getPagesTreeResult.matchFulfilled,
        (state, action) => {
          reactToRequests(
            "pagesTree",
            "requestResultsSuccessful",
            state.customers,
            state.activeCustomer,
            action.payload
          );
        }
      );
  },
});

export const {
  ADD_CUSTOMER,
  RESET_CUSTOMER,
  CHANGE_BUSINESS_FIELD,
  CHANGE_ACTIVE_CUSTOMER,
} = authSlice.actions;

export default authSlice.reducer;

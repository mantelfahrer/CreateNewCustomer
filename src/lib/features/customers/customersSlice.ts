import { Customer } from "@/models/Customer";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { hordeApi } from "../api/apiSlice";

export interface CustomersState {
  customers: Customer[];
  activeCustomer: Customer;
}

const uuid = uuidv4();
const initialCustomer: Customer = {
  id: uuid,
  businessField: "",
  generatedData: undefined,
  requestPending: false,
  requestError: false,
};

const initialState: CustomersState = {
  customers: [initialCustomer],
  activeCustomer: initialCustomer,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    ADD_CUSTOMER: (state) => {
      const newUuid = uuidv4();
      const newCustomer: Customer = {
        id: newUuid,
        businessField: "",
        generatedData: undefined,
        requestPending: false,
        requestError: false,
      };
      state.customers.push(newCustomer);
      state.activeCustomer = newCustomer;
    },
    RESET_CUSTOMER: (state, action: PayloadAction<Customer>) => {
      state.customers.forEach((customer) => {
        if (customer.id === action.payload.id) {
          customer.businessField = "";
          customer.generatedData = undefined;
          customer.requestPending = false;
          customer.requestError = false;
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
      // reset error when starting request to generate text
      .addMatcher(hordeApi.endpoints.generateText.matchPending, (state) => {
        state.customers.forEach((customer) => {
          if (customer.id === state.activeCustomer.id) {
            customer.requestError = false;
            customer.generatedData = undefined;
            customer.idApi = undefined;
            state.activeCustomer = customer;
          }
        });
      })
      // request to generate text was successful
      .addMatcher(
        hordeApi.endpoints.generateText.matchFulfilled,
        (state, action) => {
          state.customers.forEach((customer) => {
            if (customer.id === state.activeCustomer.id) {
              customer.idApi = action.payload.id;
              customer.requestPending = true;
              state.activeCustomer = customer;
            }
          });
        }
      )
      // request to check results for generated text returned an error
      .addMatcher(hordeApi.endpoints.getResult.matchRejected, (state) => {
        state.customers.forEach((customer) => {
          if (customer.id === state.activeCustomer.id) {
            customer.requestPending = false;
            customer.requestError = true;
            state.activeCustomer = customer;
          }
        });
      })
      // request to check results for generated text returned successfully
      .addMatcher(
        hordeApi.endpoints.getResult.matchFulfilled,
        (state, action) => {
          state.customers.forEach((customer) => {
            if (customer.id === state.activeCustomer.id) {
              customer.generatedData = action.payload;
              if (action.payload.done) {
                customer.requestPending = false;
                customer.requestError = false;
              }
              if (action.payload.faulted || !action.payload.is_possible) {
                customer.requestPending = false;
                customer.requestError = true;
              }
              state.activeCustomer = customer;
            }
          });
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

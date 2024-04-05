import { Customer } from "@/models/Customer";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export interface CustomersState {
  customers: Customer[];
  activeCustomer: string;
}

const uuid = uuidv4();

const initialState: CustomersState = {
  customers: [
    {
      id: uuid,
      generatedText: undefined,
    },
  ],
  activeCustomer: uuid,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    ADD_CUSTOMER: (state) => {
      const newUuid = uuidv4();
      state.customers.push({ id: newUuid, generatedText: undefined });
      state.activeCustomer = newUuid;
    },
    CHANGE_ACTIVE_CUSTOMER: (state, action: PayloadAction<string>) => {
      state.activeCustomer = action.payload;
    },
  },
});

export const { ADD_CUSTOMER, CHANGE_ACTIVE_CUSTOMER } = authSlice.actions;

export default authSlice.reducer;

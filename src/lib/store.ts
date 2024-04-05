import { configureStore } from "@reduxjs/toolkit";
import customersReducer from "./features/customers/customersSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      customers: customersReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

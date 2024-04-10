import { configureStore } from "@reduxjs/toolkit";
import customersReducer from "./features/customers/customersSlice";
import { hordeApi } from "./features/api/apiSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      customers: customersReducer,
      [hordeApi.reducerPath]: hordeApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(hordeApi.middleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

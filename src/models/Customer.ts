import { RequestStatusKobold } from "./hordeModels";

export type CustomerRequestData = {
  data?: RequestStatusKobold;
  idApi?: string;
  pending: boolean;
  error: boolean;
};

export type Customer = {
  id: string;
  businessField: string;
  overview: CustomerRequestData;
  uiUx: CustomerRequestData;
  featureList: CustomerRequestData;
  pagesTree: CustomerRequestData;
};

export function createInitialCustomerData(id: string): Customer {
  return {
    id,
    businessField: "",
    overview: {
      data: undefined,
      idApi: undefined,
      pending: false,
      error: false,
    },
    uiUx: { data: undefined, idApi: undefined, pending: false, error: false },
    featureList: {
      data: undefined,
      idApi: undefined,
      pending: false,
      error: false,
    },
    pagesTree: {
      data: undefined,
      idApi: undefined,
      pending: false,
      error: false,
    },
  };
}

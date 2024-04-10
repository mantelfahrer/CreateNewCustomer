import { RequestStatusKobold } from "./hordeModels";

export type Customer = {
  // client side id
  id: string;
  businessField: string;
  // id for use with the api
  idApi?: string;
  requestPending: boolean;
  requestError: boolean;
  generatedData?: RequestStatusKobold;
};

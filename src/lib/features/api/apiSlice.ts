import {
  GenerationInputKobold,
  RequestAsync,
  RequestError,
  RequestStatusKobold,
} from "@/models/hordeModels";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://stablehorde.net/api/v2/",
  prepareHeaders: (headers) => {
    headers.set("apikey", "DiRlHVHd1svruu4lx66moA");
    return headers;
  },
});

export const hordeApi = createApi({
  reducerPath: "hordeApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    generateText: builder.mutation<RequestAsync, GenerationInputKobold>({
      query: ({ ...data }) => ({
        url: "/generate/text/async",
        method: "POST",
        body: data,
      }),
    }),
    getResult: builder.query<RequestStatusKobold, string>({
      query: (id) => ({
        url: `generate/text/status/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGenerateTextMutation, useGetResultQuery } = hordeApi;

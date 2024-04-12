import {
  GenerationInputKobold,
  RequestAsync,
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
    // OVERVIEW
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
    // ADDITIONAL PROMPTS
    // UI UX
    generateUiUxRequirements: builder.mutation<
      RequestAsync,
      GenerationInputKobold
    >({
      query: ({ ...data }) => ({
        url: "/generate/text/async",
        method: "POST",
        body: data,
      }),
    }),
    getUiUxRequirementsResult: builder.query<RequestStatusKobold, string>({
      query: (id) => ({
        url: `generate/text/status/${id}`,
        method: "GET",
      }),
    }),
    // FEATURE LIST
    generateFeatureList: builder.mutation<RequestAsync, GenerationInputKobold>({
      query: ({ ...data }) => ({
        url: "/generate/text/async",
        method: "POST",
        body: data,
      }),
    }),
    getFeatureListResult: builder.query<RequestStatusKobold, string>({
      query: (id) => ({
        url: `generate/text/status/${id}`,
        method: "GET",
      }),
    }),
    // PAGES TREE
    generatePagesTree: builder.mutation<RequestAsync, GenerationInputKobold>({
      query: ({ ...data }) => ({
        url: "/generate/text/async",
        method: "POST",
        body: data,
      }),
    }),
    getPagesTreeResult: builder.query<RequestStatusKobold, string>({
      query: (id) => ({
        url: `generate/text/status/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGenerateTextMutation,
  useGetResultQuery,
  useGenerateUiUxRequirementsMutation,
  useGetUiUxRequirementsResultQuery,
  useGenerateFeatureListMutation,
  useGetFeatureListResultQuery,
  useGeneratePagesTreeMutation,
  useGetPagesTreeResultQuery,
} = hordeApi;

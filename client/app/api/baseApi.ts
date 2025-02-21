import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Platform } from "react-native";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: Platform.select({
      ios: "http://localhost:3000", // TODO this is only for development, we will move that later to env
      android: "http://10.0.2.2:3000",
    }),
    prepareHeaders: (headers, endpoint) => {
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [], // Add your entity types
});

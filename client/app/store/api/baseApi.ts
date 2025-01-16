import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Platform } from "react-native";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: Platform.select({
      ios: "http://localhost:3000",
      android: "http://10.0.2.2:3000",
    }),
    prepareHeaders: (headers, endpoint) => {
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: ["User", "Post", "Comment"], // Add your entity types
});

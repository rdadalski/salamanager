import { baseApi } from "./baseApi";

const testGenericApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTestGeneric: builder.query<any, void>({
      query: () => ({
        url: "/test-generic",
        method: "GET",
      }),
      transformResponse: (response: any) => {
        console.log(response);
        // Handle and transform the response if needed
        return response;
      },
    }),
  }),
});

export const { useGetTestGenericQuery, useLazyGetTestGenericQuery } = testGenericApi;
export default testGenericApi;

import { baseApi } from "./baseApi";

export const testGenericApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTestGeneric: builder.query<any, void>({
      query: () => ({
        url: "/test-generic",
        method: "GET",
      }),
      transformResponse: (response: any) => {
        // Handle and transform the response if needed
        return response;
      },
    }),
    postGeneric: builder.mutation<any, { text: string }>({
      query: (values: any) => ({
        url: `/test-generic`,
        method: "POST",
        body: values,
      }),
      invalidatesTags: [],
    }),
  }),
});

export const {
  useGetTestGenericQuery,
  useLazyGetTestGenericQuery,
  usePostGenericMutation,
} = testGenericApi;

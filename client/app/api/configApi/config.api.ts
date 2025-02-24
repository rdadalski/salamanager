import { baseApi } from "../baseApi";

const baseUrl = "/";

export const configApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGoogleApiKey: builder.query<any, void>({
      // TODO add type for response
      query: () => ({
        url: `/auth/google-auth/config`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return response;
      },
    }),
  }),
});

export const { useGetGoogleApiKeyQuery, useLazyGetGoogleApiKeyQuery } =
  configApi;

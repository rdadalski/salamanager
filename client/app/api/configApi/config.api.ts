import { baseApi } from "@app/api";

const baseUrl = "/";

export const configApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGoogleApiKey: builder.query<any, void>({
      query: () => ({
        url: `/auth/google-auth/config`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        console.log(response);
        return response;
      },
    }),
  }),
});

export const { useGetGoogleApiKeyQuery, useLazyGetGoogleApiKeyQuery } =
  configApi;

import { baseApi } from "../baseApi";
import {
  IRegisterToken,
  IRegisterTokenResponse,
  ISendNotification,
} from "@app/api/notifications/models/notification-models";

const baseUrl = "/notifications";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTestConnection: builder.query<any, void>({
      query: () => ({
        url: `${baseUrl}/test-connection`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        // Handle and transform the response if needed
        return response;
      },
    }),

    registerToken: builder.mutation<IRegisterTokenResponse, IRegisterToken>({
      query: (values: IRegisterToken) => ({
        url: `${baseUrl}/register-token`,
        method: "POST",
        body: values,
      }),
    }),

    // TODO build interface for that later

    getUserToken: builder.mutation<any, { text: string }>({
      query: (values: any) => ({
        url: `${baseUrl}/token/${values.userId}`,
        method: "POST",
        body: values,
      }),
      invalidatesTags: [],
    }),

    sendNotification: builder.mutation<any, any>({
      query: () => ({
        url: `${baseUrl}/send`,
        method: "POST",
      }),
    }),

    sendToken: builder.mutation<any, any>({
      query: (values: any) => ({
        url: `${baseUrl}/token`,
        method: "POST",
        body: values,
      }),
    }),
  }),
});

export const {
  useGetTestConnectionQuery,
  useLazyGetTestConnectionQuery,
  useGetUserTokenMutation,
  useSendNotificationMutation,
  useSendTokenMutation,
} = notificationsApi;

import { baseApi } from "./baseApi";

const baseUrl = "/notifications";

const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // @Get('test-connection')

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

    //   @Get('token/:userId')
    //   async getUserToken(@Param('userId') userId: string) {
    // TODO build interface for that later

    getUserToken: builder.mutation<any, { text: string }>({
      query: (values: any) => ({
        url: `${baseUrl}/token/${values.userId}`,
        method: "POST",
        body: values,
      }),
      invalidatesTags: [],
    }),

    //   @Post('send')
    //   async sendNotification(
    //     @Body() body: { token: string; title: string; body: string; data?: any },
    //   ) {
    //     return this.notificationsService.sendPushNotification(body);
    //   }

    sendNotification: builder.mutation<any, any>({
      query: (values: any) => ({
        url: `${baseUrl}/send`,
        method: "POST",
        body: values,
      }),
    }),

    //   @Post('token')
    //   async saveDeviceToken(@Body() deviceTokenDto: DeviceTokenDto) {
    //     console.log(deviceTokenDto);
    //     return this.notificationsService.saveExpoToken(
    //       deviceTokenDto.userId,
    //       deviceTokenDto.token,
    //       deviceTokenDto.deviceData,
    //     );
    //   }

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
export default notificationsApi;

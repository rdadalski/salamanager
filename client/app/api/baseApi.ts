import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Platform } from "react-native";
import * as Device from "expo-device";

import { getAccessToken } from "@app/services";

const getBaseUrl = () => {
  const isDevMode = __DEV__;
  const deviceType = Device.deviceType;

  // Check if this is a real device (not an emulator/simulator)
  const isRealDevice = Device.isDevice;

  let apiUrl = "";

  // For simulators/emulators in development
  if (isDevMode && !isRealDevice) {
    apiUrl = Platform.select({
      ios: "http://localhost:3000",
      android: "http://10.0.2.2:3000",
      default: "http://localhost:3000",
    });
  }

  // For physical devices in development
  if (isDevMode && isRealDevice) {
    apiUrl = "http://192.168.0.4:3000"; // Your local network IP
  }

  return apiUrl;

  // For production or staging environments
  // switch (releaseChannel) {
  //   case "production":
  //     return "https://api.yourapp.com"; //TODO Your production API endpoint
  //   case "staging":
  //     return "https://staging-api.yourapp.com"; //TODO Your staging API endpoint
  //   default:
  //     return "https://dev-api.yourapp.com"; //TODO Your development API endpoint
  // }
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: async (headers, { getState }) => {
      const token = await getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [], // Add your entity types
});

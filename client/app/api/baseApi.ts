import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Platform } from "react-native";
import * as Device from "expo-device";

const getBaseUrl = () => {
  const isDevMode = __DEV__;

  // Get device type using expo-device
  // DeviceType: 0: unknown, 1: phone, 2: tablet, 3: desktop, 4: tv
  const deviceType = Device.deviceType;

  // Check if this is a real device (not an emulator/simulator)
  const isRealDevice = Device.isDevice;

  // For simulators/emulators in development
  if (isDevMode && !isRealDevice) {
    return Platform.select({
      ios: "http://localhost:3000",
      android: "http://10.0.2.2:3000",
      default: "http://localhost:3000",
    });
  }

  // For physical devices in development
  if (isDevMode && isRealDevice) {
    return "http://192.168.0.5:3000"; // Your local network IP
  }

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
    prepareHeaders: (headers, endpoint) => {
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [], // Add your entity types
});

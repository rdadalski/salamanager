import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Platform } from "react-native";
import * as Device from "expo-device";

import { getAccessToken } from "@app/services";
import { getAuth } from "@react-native-firebase/auth";

const getBaseUrl = () => {
  const isDevMode = __DEV__;
  const deviceType = Device.deviceType;

  const isRealDevice = Device.isDevice;

  let apiUrl = "https://your-production-url.com/api";

  const functionPath = "/salamanager-1fa72/europe-central2/api";

  /* FOR FIREBASE EMULATOR  */
  // if (isDevMode && !isRealDevice) {
  //   apiUrl = Platform.select({
  //     ios: `http://localhost:5001${functionPath}`,
  //     android: `http://10.0.2.2:5001${functionPath}`,
  //     default: `http://localhost:5001${functionPath}`,
  //   });
  // }

  // For simulators/emulators in development
  if (isDevMode && !isRealDevice) {
    apiUrl = Platform.select({
      ios: "http://localhost:3000",
      android: "http://10.0.2.2:3000",
      default: "http://localhost:3000",
    });
  }

  /* FOR FIREBASE EMULATOR  */
  if (isDevMode && isRealDevice) {
    // apiUrl = `http://192.168.0.5:5001${functionPath}`; //path for emulator
    apiUrl = `http://192.168.0.9:3000`; // path for development NestJs server
  }

  return apiUrl;

  // For production or staging environments
  // switch (releaseChannel) {
  //   case "production":
  //     return "https://salamanager-1fa72.web.app/"; // TODO Your production API endpoint
  //   case "staging":
  //     return "https://staging-api.yourapp.com"; // TODO Your staging API endpoint
  //   default:
  //     return "https://dev-api.yourapp.com"; // TODO Your development API endpoint
  // }
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: async (headers, { getState }) => {
      const token = await getAccessToken();
      // TODO !!!IMPORTANT!!! - move refresh token to its own place.
      //  this is just for testing right now
      if (token) {
        const user = getAuth().currentUser;

        if (user) {
          const newToken = await user.getIdToken(true);
          headers.set("Authorization", `Bearer ${newToken}`);
        }
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "Events",
    "Calendars",
    "User",
    "Users",
    "Resource",
    "Clients",
    "ClientProfile",
    "AllClients",
    "MyClients",
  ],
});

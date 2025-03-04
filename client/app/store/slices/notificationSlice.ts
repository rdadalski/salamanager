import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFCMToken } from "@app/services/notifications";
import { notificationsApi } from "@app/api";
import { IDeviceInfo } from "@app/api/notifications/models/notification-models";
import { RootState } from "@app/store/store";

interface NotificationsState {
  token: string | null;
  isRegistered: boolean;
  registrationError: string | null;
  loading: boolean;
}

const initialState: NotificationsState = {
  token: null,
  isRegistered: false,
  registrationError: null,
  loading: false,
};

export const registerFCMToken = createAsyncThunk(
  "notifications/registerToken",
  async (
    arg: { userId: string; deviceInfo: IDeviceInfo },
    { rejectWithValue, dispatch },
  ) => {
    try {
      // Get the FCM token
      const token = await getFCMToken();
      const { userId, deviceInfo } = arg;

      if (!token) {
        return rejectWithValue("Failed to get FCM token");
      }

      // Register with backend
      const response = await dispatch(
        notificationsApi.endpoints.registerToken.initiate({
          userId,
          token,
          deviceInfo,
        }),
      ).unwrap();

      if (!response.success) {
        return rejectWithValue("Failed to register token with backend");
      }

      return { token };
    } catch (e) {
      const error = e as Error;
      return rejectWithValue(error.message || "Failed to register token");
    }
  },
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotificationErrors: (state) => {
      state.registrationError = null;
    },
    resetNotificationState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerFCMToken.pending, (state) => {
        state.loading = true;
        state.registrationError = null;
      })
      .addCase(registerFCMToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isRegistered = true;
      })
      .addCase(registerFCMToken.rejected, (state, action) => {
        state.loading = false;
        state.registrationError = action.payload as string;
      });
  },
});

export const { clearNotificationErrors, resetNotificationState } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;

export const selectFCMToken = (state: RootState) => state.notifications.token;

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "@app/api/";
import configSlice from "@app/store/slices/configSlice";
import notificationSlice from "@app/store/slices/notificationSlice";
import authSlice from "@app/store/slices/authSlice";

export const store = configureStore({
  reducer: {
    config: configSlice,
    notifications: notificationSlice,
    auth: authSlice,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "@app/api/";
import { notificationsApi } from "@app/api/";
import { configApi } from "@app/api/";
import configSlice from "@app/store/slices/configSlice";
import notificationSlice from "@app/store/slices/notificationSlice";
import { authApi } from "@app/api/auth/auth.api";

export const store = configureStore({
  reducer: {
    config: configSlice,
    notifications: notificationSlice,
    [baseApi.reducerPath]: baseApi.reducer,
    notificationApi: notificationsApi.reducer,
    configApi: configApi.reducer,
    authApi: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware,
      notificationsApi.middleware,
      configApi.middleware,
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

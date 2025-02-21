import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "@app/api/";
import { notificationsApi } from "@app/api/";
import { configApi } from "@app/api/";
import configSlice from "@app/store/slices/configSlice";

export const store = configureStore({
  reducer: {
    config: configSlice,
    [baseApi.reducerPath]: baseApi.reducer,
    notificationApi: notificationsApi.reducer,
    configApi: configApi.reducer,
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

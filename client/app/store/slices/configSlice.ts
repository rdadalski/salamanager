import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IConfigState, IGoogleWebClient, LoadingStatus } from "@app/types";
import { configApi } from "@app/api";
import { RootState } from "@app/store/store";
import { act } from "react";

const initialState: IConfigState = {
  google: {
    webclientId: null,
    scopes: [],
  },
  defaultCalendarId: null,
  status: LoadingStatus.IDLE,
  error: null,
};

export const fetchGoogleConfig = createAsyncThunk(
  "config/fetchGoogleConfig",
  async (_, { dispatch }) => {
    try {
      const response = await dispatch(
        configApi.endpoints.getGoogleApiKey.initiate(),
      ).unwrap();
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
);

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setGoogleConfig: (state, action: PayloadAction<IGoogleWebClient>) => {
      state.google = action.payload;
      state.status = LoadingStatus.SUCCEEDED;
    },
    setDefaultCalendarId: (state, action: PayloadAction<string>) => {
      state.defaultCalendarId = action.payload;
    },
    clearConfig: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoogleConfig.pending, (state) => {
        state.status = LoadingStatus.LOADING;
      })
      .addCase(fetchGoogleConfig.fulfilled, (state, action) => {
        state.status = LoadingStatus.SUCCEEDED;
        state.google = action.payload;
      })
      .addCase(fetchGoogleConfig.rejected, (state, action) => {
        console.log("rejected");
        state.status = LoadingStatus.FAILED;
        state.error = action.error.message || "Failed to load config";
      });
  },
});

export const { setGoogleConfig, setDefaultCalendarId, clearConfig } =
  configSlice.actions;
export default configSlice.reducer;

export const selectGoogleConfig = (state: RootState) => state.config.google;
export const selectCalendarId = (state: RootState) =>
  state.config.defaultCalendarId;
export const selectConfigStatus = (state: RootState) => state.config.status;
export const selectConfigError = (state: RootState) => state.config.error;

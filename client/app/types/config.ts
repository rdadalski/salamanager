export interface IGoogleWebClient {
  webclientId: string | null;
  scopes: string[];
}

export interface IConfigState {
  google: IGoogleWebClient;
  status: LoadingStatus;
  error: string | null;
  defaultCalendarId: string | null;
}

export enum LoadingStatus {
  IDLE = "idle",
  LOADING = "loading",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
}

export enum RequestStatus {
  IDLE = "idle",
  PENDING = "pending",
  FULFILLED = "fulfilled",
  REJECTED = "rejected",
}

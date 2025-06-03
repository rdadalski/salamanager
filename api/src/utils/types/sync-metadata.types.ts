export interface ISyncMetadata {
  id?: string;
  calendarId: string;
  syncToken?: string | null;
  lastSyncTime: Date;
  isInitialSyncComplete: boolean;
}

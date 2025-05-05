export interface ICalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
  attendees?: {
    email: string;
    displayName?: string;
    responseStatus?: "needsAction" | "declined" | "tentative" | "accepted";
  }[];
  sendUpdates?: "all" | "externalOnly" | "none";
  reminders?: {
    useDefault: boolean;
    overrides?: {
      method: "email" | "popup";
      minutes: number;
    }[];
  };
}

export interface ICalendarListEntry {
  kind: string;
  etag: string;
  id: string;
  summary: string;
  description?: string;
  timeZone: string;
  summaryOverride?: string;
  colorId: string;
  backgroundColor: string;
  foregroundColor: string;
  selected?: boolean;
  accessRole: string;
  defaultReminders: IDefaultReminder[];
  notificationSettings?: INotificationSettings;
  primary?: boolean;
  conferenceProperties: IConferenceProperties;
}

export interface IDefaultReminder {
  method: string;
  minutes: number;
}

export interface INotificationSettings {
  notifications: INotification[];
}

export interface INotification {
  type: string;
  method: string;
}

export interface IConferenceProperties {
  allowedConferenceSolutionTypes: string[];
}

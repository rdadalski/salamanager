export interface ICalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  attendees?: {
    email: string;
    displayName?: string;
    responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  }[];
  sendUpdates?: 'all' | 'externalOnly' | 'none';
  reminders?: {
    useDefault: boolean;
    overrides?: {
      method: 'email' | 'popup';
      minutes: number;
    }[];
  };
}

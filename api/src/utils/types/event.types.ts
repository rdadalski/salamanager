interface IInternalEvent {
  id?: string;
  googleEventId: string;
  calendarId: string;
  resourceId: string;
  summary: string;
  displayTitle?: string;
  startTime: string;
  endTime: string;
  status: string;
  defaultResourcePrice: number;
  clients: string[];
}

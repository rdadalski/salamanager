export interface IInternalEvent {
  id?: string;
  googleEventId: string;
  calendarId: string;
  resourceId: string;
  summary: string;
  displayTitle?: string;
  startTime: string;
  endTime: string;
  status?: string;
  defaultResourcePrice?: number;
  clients?: string[];
}

export interface IResource {
  id?: string;
  name: string;
  defaultPrice: number;
  ownerId: string;
  minTimeBox: string;
  clients?: string[];
}

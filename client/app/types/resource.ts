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
  attendees?: IAttendee[];
}

export interface IAttendee {
  uid: string;
  status: AttendanceStatus;
  attended: boolean;
}

export enum AttendanceStatus {
  CONFIRMED = "confirmed",
  PENDING_CONFIRMATION = "pending_confirmation",
  REJECTED = "rejected",
}

export interface IResource {
  id?: string;
  name: string;
  defaultPrice: number;
  ownerId: string;
  minTimeBox: string;
  clients?: string[];
}

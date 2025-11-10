export interface IInternalEvent {
  id?: string;
  googleEventId: string;
  calendarId: string;
  resourceId: string;
  googleRecurringEventId: string;
  summary: string;
  displayTitle?: string;
  startTime: string;
  endTime: string;
  attendees: IAttendee[];
}

export interface IAttendee {
  uid: string;
  status: AttendanceStatus;
  attended: boolean;
}

export enum AttendanceStatus {
  CONFIRMED = 'confirmed',
  PENDING_CONFIRMATION = 'pending_confirmation',
  REJECTED = 'rejected',
}

import { Timestamp } from 'firebase-admin/firestore';

export interface IInternalEvent {
  id?: string;
  trainerId: string;
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

export interface IInternalEventFirestore extends Omit<IInternalEvent, 'startTime' | 'endTime'> {
  startTime: Timestamp;
  endTime: Timestamp;
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

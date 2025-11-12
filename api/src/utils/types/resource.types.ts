import { Timestamp } from 'firebase-admin/firestore';

export interface IResource {
  id?: string;
  googleEventId: string;
  name: string;
  defaultPrice: number;
  trainerId: string;
  recurrence: string[];
  startTime: string | Timestamp;
  endTime: string | Timestamp;
  minTimeBox: string;
  clients?: string[];
  calendarId: string;
  configured?: boolean;
}

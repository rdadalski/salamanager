export interface IResource {
  id?: string;
  googleEventId: string;
  name: string;
  defaultPrice: number;
  trainerId: string;
  recurrence: string[];
  startTime: string;
  endTime: string;
  minTimeBox: string;
  clients?: string[];
  calendarId: string;
}

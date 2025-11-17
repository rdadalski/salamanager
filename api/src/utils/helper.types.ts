import { Timestamp } from 'firebase-admin/firestore';

export type FirestoreDate<T> = {
  [K in keyof T]: K extends 'startTime' | 'endTime' ? Timestamp : T[K];
};

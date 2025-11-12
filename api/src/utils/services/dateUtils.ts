import { FirestoreDate } from '@app/utils/helper.types';
import { Timestamp } from 'firebase-admin/firestore';

export function convertFromFirestore<T extends { startTime?: any; endTime?: any }>(doc: FirestoreDate<T>): T {
  return {
    ...doc,
    ...(doc.startTime && { startTime: doc.startTime.toDate().toISOString() }),
    ...(doc.endTime && { endTime: doc.endTime.toDate().toISOString() }),
  } as T;
}

export function convertToFirestore<T extends { startTime?: string; endTime?: string }>(
  data: Partial<T>
): Partial<FirestoreDate<T>> {
  return {
    ...data,
    ...(data.startTime && { startTime: Timestamp.fromDate(new Date(data.startTime)) }),
    ...(data.endTime && { endTime: Timestamp.fromDate(new Date(data.endTime)) }),
  } as Partial<FirestoreDate<T>>;
}

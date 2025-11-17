import { Timestamp } from 'firebase-admin/firestore';

export interface IClient {
  name: string;
  surname: string;
  email: string;
  phone: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  trainerId: string;
  userId?: string;
  notes?: string;
  status: 'active' | 'inactive' | 'pending';
}

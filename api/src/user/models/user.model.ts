import { Timestamp } from 'firebase-admin/firestore';

export interface User {
  googleRefreshToken?: string;
  uid: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
  phoneNumber?: string | null;
  createdAt: Timestamp;
  lastLogin: Timestamp;
}

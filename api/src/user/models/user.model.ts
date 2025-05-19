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
  role: UserRole;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  TRAINER = 'trainer',
  CLIENT = 'client',
  GUEST = 'guest',
}

export type UserRoleType = keyof typeof UserRole;

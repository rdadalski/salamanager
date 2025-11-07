export interface IFirestoreUserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
  metadata: {
    creationTime: string | undefined;
    lastSignInTime: string | undefined;
  };
  role: UserRole;
}

export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  TRAINER = "trainer",
  CLIENT = "client",
  GUEST = "guest",
}

export type UserRoleType = `${UserRole}`;

export interface IFirestoreCreateUserRequest extends IFirestoreUserData {
  serverAuthCode?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  uid: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
  authProvider: "password" | "google.com";
}

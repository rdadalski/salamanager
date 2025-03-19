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
}

export interface IFirestoreCreateUserRequest extends IFirestoreUserData {
  serverAuthCode: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  authProvider: "password" | "google.com";
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

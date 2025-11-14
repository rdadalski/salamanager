export const FIRESTORE_COLLECTIONS = {
  CLIENTS: 'clients',
  USERS: 'users',
  RESOURCES: 'resources',
  SYNC_METADATA: 'sync_metadata',
  USER_TOKENS: 'user_tokens',
  EVENTS: 'events',
} as const;

export type FirestoreCollection = (typeof FIRESTORE_COLLECTIONS)[keyof typeof FIRESTORE_COLLECTIONS];

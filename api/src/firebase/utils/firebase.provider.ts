import { GenericFirestoreService } from '@app/firebase/generic-firestore.service';
import { FirestoreCollection } from '@app/firebase/utils/firebase.constants';
import type { app } from 'firebase-admin';

export const createFirestoreProvider = <T>(collectionName: FirestoreCollection) => ({
  provide: getFirestoreToken(collectionName),
  useFactory: (firebaseAdmin: app.App) => new GenericFirestoreService<T>(firebaseAdmin, collectionName),
  inject: ['FIREBASE_ADMIN'],
});

export const getFirestoreToken = (collectionName: string) => `${collectionName.toUpperCase()}_FIRESTORE_SERVICE`;

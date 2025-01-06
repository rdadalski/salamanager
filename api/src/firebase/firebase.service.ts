import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { app } from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private db: admin.firestore.Firestore;
  #collection: FirebaseFirestore.CollectionReference;

  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {
    this.db = this.firebaseAdmin.firestore();
  }

  async addItem(data: any) {
    console.log(data);

    try {
      const docRef = await this.db.collection('testCollection').add(data);
      return { id: docRef.id, ...data }; // Return the document ID and data
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }

  async verifyToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      return await admin.auth().verifyIdToken(idToken);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async createUser(
    email: string,
    password: string,
  ): Promise<admin.auth.UserRecord> {
    return admin.auth().createUser({ email, password });
  }
}

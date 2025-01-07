import { Injectable, Inject } from '@nestjs/common';
import { CollectionReference } from '@google-cloud/firestore';
import { app } from 'firebase-admin';

@Injectable()
export class GenericFirestoreService<T> {
  private collection: CollectionReference;

  constructor(
    @Inject('FIREBASE_ADMIN') private firebaseAdmin: app.App,
    private collectionName: string,
  ) {
    this.collection = this.firebaseAdmin
      .firestore()
      .collection(this.collectionName);
  }

  async create(data: T): Promise<string> {
    const docRef = await this.collection.add(data);
    return docRef.id;
  }

  async findOne(id: string): Promise<T | null> {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? (doc.data() as T) : null;
  }

  async findAll(): Promise<T[]> {
    const snapshot = await this.collection.get();
    return snapshot.docs.map((doc) => doc.data() as T);
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    await this.collection.doc(id).update(data);
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }
}

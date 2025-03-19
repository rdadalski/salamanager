import { Injectable, Inject, Logger } from '@nestjs/common';
import { CollectionReference } from '@google-cloud/firestore';
import { app, FirebaseError } from 'firebase-admin';

@Injectable()
export class GenericFirestoreService<T> {
  private readonly collection: CollectionReference;
  private readonly logger = new Logger(GenericFirestoreService.name);

  constructor(
    @Inject('FIREBASE_ADMIN') private firebaseAdmin: app.App,
    private collectionName: string
  ) {
    this.collection = this.firebaseAdmin.firestore().collection(this.collectionName);
  }

  async create(data: T, docId?: string): Promise<string> {
    try {
      if (docId) {
        // Use the provided ID for the document
        const docRef = this.collection.doc(docId);
        await docRef.set(data);

        return docId;
      } else {
        // Auto-generate ID if none provided
        const docRef = await this.collection.add(data);
        return docRef.id;
      }
    } catch (e) {
      const error = e as FirebaseError;
      this.logger.error('Error creating document:', error.message);
      throw e;
    }
  }

  async findOne(id: string): Promise<T | null> {
    try {
      const doc = await this.collection.doc(id).get();
      return doc.exists ? (doc.data() as T) : null;
    } catch (e) {
      console.log(e);
    }
  }

  async findAll(): Promise<T[]> {
    try {
      const snapshot = await this.collection.get();
      return snapshot.docs.map((doc) => doc.data() as T);
    } catch (e) {
      console.log(e);
    }
  }

  async findByQuery(queries: { field: string; operator: FirebaseFirestore.WhereFilterOp; value: any }[]): Promise<T[]> {
    try {
      let query: FirebaseFirestore.Query = this.collection;

      queries.forEach((q) => {
        query = query.where(q.field, q.operator, q.value);
      });

      const snapshot = await query.get();
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as T
      );
    } catch (e) {
      console.log(e);
    }
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      await this.collection.doc(id).update(data);
    } catch (e) {
      console.log(e);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.collection.doc(id).delete();
    } catch (e) {
      console.log(e);
    }
  }
}

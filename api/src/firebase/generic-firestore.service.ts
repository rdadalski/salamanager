import { Injectable, Logger } from '@nestjs/common';
import { app, FirebaseError } from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import {
  CollectionReference,
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';

@Injectable()
export class GenericFirestoreService<T> {
  protected collection: CollectionReference;
  private readonly logger = new Logger(GenericFirestoreService.name);

  private readonly converter: FirestoreDataConverter<T> = {
    toFirestore(data: T): DocumentData {
      return data as DocumentData;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): T {
      return snapshot.data() as T;
    },
  };

  constructor(firebaseAdmin: app.App, collectionName: string) {
    this.collection = getFirestore(firebaseAdmin).collection(collectionName).withConverter(this.converter);
  }

  async create(data: T, docId?: string): Promise<string> {
    this.logger.log(data);

    try {
      if (docId) {
        const docRef = this.collection.doc(docId);
        await docRef.set(data);

        return docId;
      } else {
        const docRef = await this.collection.add(data);
        return docRef.id;
      }
    } catch (e) {
      const error = e as FirebaseError;
      this.logger.error('Error creating document:', error.message);
      throw e;
    }
  }

  async createBulk<T extends { id?: string; googleEventId?: string }>(
    data: T[],
    getDocId?: (item: T) => string
  ): Promise<void> {
    const db = getFirestore();
    const BATCH_SIZE = 500;

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const chunk = data.slice(i, i + BATCH_SIZE);
      const batch = db.batch();

      chunk.forEach((item) => {
        const docId = getDocId ? getDocId(item) : item.googleEventId || item.id || this.collection.doc().id;
        const docRef = this.collection.doc(docId);
        batch.set(docRef, item);
      });

      await batch.commit();
    }
  }

  async findOne(id: string): Promise<T | null> {
    try {
      const doc = await this.collection.doc(id).get();
      if (!doc.exists) return null;

      const data = this.convertTimestamps(doc.data());

      return data as T;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async findAll(): Promise<T[]> {
    try {
      const snapshot = await this.collection.get();
      return snapshot.docs.map((doc) => {
        // Combine the document data with the id
        return {
          ...(doc.data() as T),
          id: doc.id,
        };
      });
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

  async update(id: string, data: Partial<T>): Promise<{ success: boolean; data?: T; error?: string }> {
    if (!id || !id.trim()) {
      throw new Error('Document ID is required');
    }

    if (!data || Object.keys(data).length === 0) {
      throw new Error('Update data cannot be empty');
    }

    try {
      await this.collection.doc(id).update(data);

      const updatedDoc = await this.collection.doc(id).get();

      if (!updatedDoc.exists) {
        throw new Error('Document not found after update');
      }

      return {
        success: true,
        data: { id: updatedDoc.id, ...updatedDoc.data() } as T,
      };
    } catch (error) {
      console.error(`Failed to update document ${id}:`, {
        error: error.message,
        data,
        timestamp: new Date().toISOString(),
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.collection.doc(id).delete();
    } catch (e) {
      console.log(e);
    }
  }

  private convertTimestamps(data: any): any {
    if (!data) return data;

    const converted = { ...data };

    Object.keys(converted).forEach((key) => {
      if (converted[key]?.toDate) {
        converted[key] = converted[key].toDate();
      }
    });

    return converted;
  }
}

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
    // Validate input
    if (!id || !id.trim()) {
      throw new Error('Document ID is required');
    }

    if (!data || Object.keys(data).length === 0) {
      throw new Error('Update data cannot be empty');
    }

    try {
      // Perform the update
      await this.collection.doc(id).update(data);

      // Optionally fetch and return updated document
      const updatedDoc = await this.collection.doc(id).get();

      if (!updatedDoc.exists) {
        throw new Error('Document not found after update');
      }

      return {
        success: true,
        data: { id: updatedDoc.id, ...updatedDoc.data() } as T,
      };
    } catch (error) {
      // Log error with context
      console.error(`Failed to update document ${id}:`, {
        error: error.message,
        data,
        timestamp: new Date().toISOString(),
      });

      // Return structured error response
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
}

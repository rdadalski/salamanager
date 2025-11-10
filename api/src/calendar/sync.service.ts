import { Injectable, Logger, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { IInternalEvent, ISyncMetadata } from '@app/utils/types';
import { GenericFirestoreService } from '@app/firebase/generic-firestore.service';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  private eventsService: GenericFirestoreService<IInternalEvent>;
  private syncMetadataService: GenericFirestoreService<ISyncMetadata>;

  constructor(@Inject('FIREBASE_ADMIN') private firebaseAdmin: admin.app.App) {
    this.eventsService = new GenericFirestoreService<IInternalEvent>(firebaseAdmin, 'events');
    this.syncMetadataService = new GenericFirestoreService<ISyncMetadata>(firebaseAdmin, 'sync_metadata');
  }

  // Save sync metadata (sync token, last sync time)
  async saveSyncMetadata(metadata: ISyncMetadata): Promise<void> {
    try {
      const cleanMetadata: any = {
        calendarId: metadata.calendarId,
        lastSyncTime: new Date(),
        isInitialSyncComplete: metadata.isInitialSyncComplete,
      };

      if (metadata.syncToken) {
        cleanMetadata.syncToken = metadata.syncToken;
      }

      await this.syncMetadataService.create(cleanMetadata, metadata.calendarId);

      this.logger.log(`Sync metadata saved for calendar: ${metadata.calendarId}`);
    } catch (error) {
      this.logger.error('Error saving sync metadata:', error);
      throw error;
    }
  }

  // Get sync metadata for a calendar
  async getSyncMetadata(calendarId: string): Promise<ISyncMetadata | null> {
    try {
      return await this.syncMetadataService.findOne(calendarId);
    } catch (error) {
      this.logger.error('Error getting sync metadata:', error);
      throw error;
    }
  }

  // Save events to Firebase
  async saveEvents(events: IInternalEvent[]): Promise<void> {
    try {
      await this.eventsService.createBulk(events, (event) => event.googleEventId);
      this.logger.log(`Saved ${events.length} events to Firebase`);
    } catch (error) {
      this.logger.error('Error saving events:', error);
      throw error;
    }
  }

  // Delete events from Firebase
  async deleteEvents(googleEventIds: string[]): Promise<void> {
    try {
      for (const eventId of googleEventIds) {
        await this.eventsService.delete(eventId);
      }
      this.logger.log(`Deleted ${googleEventIds.length} events from Firebase`);
    } catch (error) {
      this.logger.error('Error deleting events:', error);
      throw error;
    }
  }

  // Get all events for a calendar
  async getEventsByCalendar(calendarId: string): Promise<IInternalEvent[]> {
    try {
      return await this.eventsService.findByQuery([{ field: 'calendarId', operator: '==', value: calendarId }]);
    } catch (error) {
      this.logger.error('Error getting events by calendar:', error);
      throw error;
    }
  }

  // TODO return type
  async initialSync(userId: string, calendarId: string): Promise<any> {
    // events.filter((e) => e.resourceId === null)
  }

  async getEventInstances(recurringEventId: string): Promise<IInternalEvent[]> {
    return await this.eventsService.findByQuery([{ field: 'resourceId', operator: '==', value: recurringEventId }]);
  }

  async assignGroupToInstances(recurringEventId: string, groupId: string): Promise<void> {
    const instances = await this.getEventInstances(recurringEventId);

    for (const instance of instances) {
      await this.eventsService.update(instance.googleEventId, {
        resourceId: groupId, // lub dodaj nowe pole groupId
      });
    }

    this.logger.log(`Assigned groupId ${groupId} to ${instances.length} instances`);
  }
}

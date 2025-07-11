import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { google, calendar_v3 } from 'googleapis';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { ICalendarEvent } from '@app/calendar/interfaces/calendar-event.interface';
import { IInternalEvent } from '@app/utils/types/event.types';
import { SyncService } from '@app/calendar/sync.service';
import process from 'node:process';

@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);

  constructor(private syncService: SyncService) {}

  private async getCalendarClient(idToken: string) {
    try {
      // Verify the Firebase ID token
      const decodedToken = await getAuth().verifyIdToken(idToken);
      const uid = decodedToken.uid;

      // Get the user from Firestore to retrieve their Google access token
      const userDoc = await getFirestore().collection('users').doc(uid).get();

      if (!userDoc.exists) {
        throw new BadRequestException('User not found');
      }

      const userData = userDoc.data();

      // Create an OAuth2 client with the stored tokens
      const oAuth2Client = new google.auth.OAuth2(
        process.env.WEB_CLIENT_ID,
        process.env.WEB_CLIENT_SECRET,
        process.env.WEB_CLIENT_REDIRECT_URI
      );

      oAuth2Client.setCredentials({
        access_token: idToken,
        refresh_token: userData.googleRefreshToken,
      });

      // Setup token refresh handler
      // oAuth2Client.on('tokens', async (tokens) => {
      //   if (tokens.refresh_token) {
      //     // Store the new refresh token
      //     await getFirestore().collection('users').doc(uid).update({
      //       googleRefreshToken: tokens.refresh_token,
      //     });
      //   }
      //   if (tokens.access_token) {
      //     // Store the new access token
      //     await getFirestore().collection('users').doc(uid).update({
      //       googleAccessToken: tokens.access_token,
      //     });
      //   }
      // });

      // Create the calendar client
      return google.calendar({ version: 'v3', auth: oAuth2Client });
    } catch (error) {
      this.logger.error(`Failed to initialize Google Calendar client: ${error.message}`);
      throw error;
    }
  }

  public async listEvents(
    idToken: string,
    params: {
      id?: string;
      timeMin?: string;
      timeMax?: string;
      maxResults?: number;
    } = {}
  ): Promise<ICalendarEvent[]> {
    try {
      const calendar = await this.getCalendarClient(idToken);

      const response = await calendar.events.list({
        calendarId: params.id,
        timeMin: new Date(params.timeMin).toISOString(),
        timeMax: new Date(params.timeMax).toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: params.maxResults,
      });

      const events = response.data.items as ICalendarEvent[];

      return events;
    } catch (error) {
      this.logger.error(`Failed to list events: ${error.message}`);
      throw error;
    }
  }

  public async getCalendarList(idToken: string) {
    try {
      const calendar = await this.getCalendarClient(idToken);
      const response = await calendar.calendarList.list();

      return response.data.items as ICalendarEvent[];
    } catch (error) {
      this.logger.error(`Failed to list events: ${error.message}`);
      throw error;
    }
  }

  public async createEvent(idToken: string, eventData: calendar_v3.Schema$Event): Promise<calendar_v3.Schema$Event> {
    try {
      const calendar = await this.getCalendarClient(idToken);

      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: eventData,
      });

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to create event: ${error.message}`);
      throw error;
    }
  }

  public async updateEvent(
    idToken: string,
    eventId: string,
    eventData: calendar_v3.Schema$Event
  ): Promise<{ success: boolean; data: calendar_v3.Schema$Event }> {
    try {
      const calendar = await this.getCalendarClient(idToken);
      this.logger.log(eventData);

      const response = await calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        requestBody: eventData,
      });

      return { success: true, data: response.data };
    } catch (error) {
      this.logger.error(`Failed to update event ${eventId}: ${error.message}`);
      throw error;
    }
  }

  public async deleteEvent(idToken: string, eventId: string): Promise<boolean> {
    try {
      const calendar = await this.getCalendarClient(idToken);

      await calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
      });

      return true;
    } catch (error) {
      this.logger.error(`Failed to delete event ${eventId}: ${error.message}`);
      throw error;
    }
  }

  private convertToInternalEvents(googleEvents: any[], calendarId: string): IInternalEvent[] {
    console.log('convertToInternalEvents');

    return googleEvents
      .filter((event) => event.status !== 'cancelled')
      .map((event) => ({
        googleEventId: event.id,
        calendarId: calendarId,
        resourceId: null,
        summary: event.summary || 'No Title',
        displayTitle: event.summary,
        startTime: event.start?.dateTime || event.start?.date,
        endTime: event.end?.dateTime || event.end?.date,
        clients: [],
      }));
  }

  // async syncCalendarEvents(calendarId: string, accessToken: string): Promise<IInternalEvent[]> {
  // TODO
  async syncCalendarEvents(calendarId: string, accessToken: string): Promise<any> {
    try {
      const calendar = await this.getCalendarClient(accessToken);

      // Get existing sync metadata
      const syncMetadata = await this.syncService.getSyncMetadata(calendarId);

      let syncToken: string | null;
      let isInitialSync = false;

      if (syncMetadata?.isInitialSyncComplete && syncMetadata?.syncToken) {
        syncToken = syncMetadata.syncToken;
        this.logger.log('✅ Using sync token for incremental sync:', syncToken.substring(0, 20) + '...');
      } else {
        isInitialSync = true;
      }

      // Call Google Calendar API with or without sync token
      const response = await calendar.events.list({
        calendarId: calendarId,
        syncToken: syncToken,
        singleEvents: true,
        maxResults: 2500,
      });

      const events = this.filterEventsWithinTwoWeeks(response.data.items) || [];
      const newSyncToken = response.data.nextSyncToken;

      // Process events (convert to your internal format)
      const internalEvents = this.convertToInternalEvents(events, calendarId);

      console.log(internalEvents);

      // Save events to Firebase
      if (internalEvents.length > 0) {
        await this.syncService.saveEvents(internalEvents);
      }

      // // Save new sync metadata
      await this.syncService.saveSyncMetadata({
        calendarId,
        syncToken: newSyncToken,
        lastSyncTime: new Date(),
        isInitialSyncComplete: true,
      });

      return { internalEvents: internalEvents, fullResponse: response.data };
    } catch (error) {
      this.logger.error('Sync failed:', error);

      // Handle specific Google API errors
      if (error.response?.status === 410 || error.code === 410) {
        this.logger.warn('Sync token expired (410), performing full sync');
        return this.performFullSync(calendarId, accessToken);
      }

      if (error.response?.status === 403) {
        this.logger.error('Access forbidden (403) - check permissions');
        throw new Error('Calendar access forbidden. Check permissions.');
      }

      if (error.response?.status === 401) {
        this.logger.error('Unauthorized (401) - token may be expired');
        throw new Error('Unauthorized. Please re-authenticate.');
      }

      throw error;
    }
  }

  private filterEventsWithinTwoWeeks(events: calendar_v3.Schema$Event[]): calendar_v3.Schema$Event[] {
    const today = new Date();

    // Calculate 2 weeks back and 2 weeks forward
    const twoWeeksBack = new Date(today);
    twoWeeksBack.setDate(today.getDate() - 14);
    twoWeeksBack.setHours(0, 0, 0, 0);

    const twoWeeksForward = new Date(today);
    twoWeeksForward.setDate(today.getDate() + 14);
    twoWeeksForward.setHours(23, 59, 59, 999);

    return events.filter((event) => {
      try {
        // Get event start time
        let eventStart: Date;

        if (event.start?.dateTime) {
          // Event with specific time
          eventStart = new Date(event.start.dateTime);
        } else if (event.start?.date) {
          // All-day event
          eventStart = new Date(event.start.date);
        } else {
          // Skip events without valid start time
          this.logger.warn(`Event ${event.id} has no valid start time`);
          return false;
        }

        // Check if event falls within the 4-week window
        const isWithinRange = eventStart >= twoWeeksBack && eventStart <= twoWeeksForward;

        return isWithinRange;
      } catch (error) {
        this.logger.error(`Error processing event ${event.id}:`, error);
        return false;
      }
    });
  }

  // Helper method: Full sync fallback
  async clearCalendarEvents(calendarId: string): Promise<void> {
    try {
      const existingEvents = await this.syncService.getEventsByCalendar(calendarId);
      if (existingEvents.length > 0) {
        const eventIds = existingEvents.map((event) => event.googleEventId);
        await this.syncService.deleteEvents(eventIds);
        this.logger.log(`Cleared ${existingEvents.length} existing events for calendar ${calendarId}`);
      }
    } catch (error) {
      this.logger.error('Failed to clear calendar events:', error);
      throw error;
    }
  }

  // Update performFullSync method
  private async performFullSync(calendarId: string, accessToken: string): Promise<IInternalEvent[]> {
    // Clear existing events and sync metadata
    await this.clearCalendarEvents(calendarId);

    await this.syncService.saveSyncMetadata({
      calendarId,
      syncToken: undefined,
      lastSyncTime: new Date(),
      isInitialSyncComplete: false,
    });

    // Recursive call without sync token
    return this.syncCalendarEvents(calendarId, accessToken);
  }
}

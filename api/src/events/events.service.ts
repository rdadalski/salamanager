import { Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateInternalEventDto } from './dto/create-event.dto';
import { UpdateInternalEventDto } from './dto/update-event.dto';
import { GenericFirestoreService } from '@app/firebase/generic-firestore.service';
import * as admin from 'firebase-admin';
import { AttendanceStatus, IAttendee, IInternalEvent } from '@app/utils/types/event.types';
import { DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

@Injectable()
export class EventsService {
  private genericService: GenericFirestoreService<IInternalEvent>;
  private readonly logger = new Logger(EventsService.name);
  private readonly db = getFirestore();
  private readonly eventsCollection = this.db.collection('events');

  constructor(@Inject('FIREBASE_ADMIN') firebaseAdmin: admin.app.App) {
    this.genericService = new GenericFirestoreService<IInternalEvent>(firebaseAdmin, 'events');
  }

  async create(createEventDto: CreateInternalEventDto) {
    const response = await this.genericService.create(createEventDto);

    this.logger.log(response);
    // TODO there is always something to do
    //  like error handling
    return response;
  }

  async findAll() {
    return await this.genericService.findAll();
  }

  async findOne(id: string) {
    return await this.genericService.findOne(id);
  }

  async findByGoogleEventId(googleEventId: string) {
    return await this.genericService.findByQuery([{ field: 'googleEventId', operator: '==', value: googleEventId }]);
  }

  async findByGoogleCalendarId(calendarId: string): Promise<IInternalEvent[]> {
    // Input validation
    if (!calendarId || typeof calendarId !== 'string') {
      this.logger.error('Invalid calendarId provided:', calendarId);
      throw new Error('Calendar ID is required and must be a valid string');
    }

    if (calendarId.trim().length === 0) {
      this.logger.error('Empty calendarId provided');
      throw new Error('Calendar ID cannot be empty');
    }

    try {
      this.logger.log(`Finding events for calendar: ${calendarId}`);

      const events = await this.genericService.findByQuery([
        { field: 'calendarId', operator: '==', value: calendarId.trim() },
      ]);

      if (!events) {
        this.logger.warn(`No events found for calendar: ${calendarId}`);
        return [];
      }

      this.logger.log(`Found ${events.length} events for calendar: ${calendarId}`);
      return events;
    } catch (error) {
      // Log the error with context
      this.logger.error(`Failed to find events for calendar ${calendarId}:`, {
        error: error.message,
        stack: error.stack,
        calendarId,
      });

      // Re-throw with more context if it's our validation error
      if (error.message.includes('Calendar ID')) {
        throw error;
      }

      // Handle Firestore-specific errors
      if (error.code) {
        switch (error.code) {
          case 'permission-denied':
            throw new Error('Permission denied accessing calendar events');
          case 'unavailable':
            throw new Error('Calendar service temporarily unavailable');
          case 'deadline-exceeded':
            throw new Error('Calendar query timed out');
          default:
            throw new Error(`Calendar query failed: ${error.message}`);
        }
      }

      // Generic fallback
      throw new Error('Failed to retrieve calendar events');
    }
  }

  /**
   * A private helper method to update an attendee's status for an event.
   * @param eventId The ID of the event.
   * @param user The authenticated user.
   * @param newStatus The new status to set for the user.
   */
  private async updateAttendeeStatus(
    eventId: string,
    user: DecodedIdToken,
    newStatus: AttendanceStatus
  ): Promise<void> {
    const eventData = await this.genericService.findOne(eventId);
    const attendees = eventData.attendees || [];
    let userFound = false;

    const updatedAttendees = attendees.map((attendee) => {
      if (attendee.uid === user.uid) {
        userFound = true;
        return { ...attendee, status: newStatus };
      }
      return attendee;
    });

    if (!userFound) {
      throw new UnauthorizedException('You are not an attendee of this event.');
    }

    await this.genericService.update(eventId, { attendees: updatedAttendees });
  }

  /**
   * Updates a user's status to 'confirmed' for a specific event.
   */
  async acceptEventChange(eventId: string, user: DecodedIdToken): Promise<void> {
    await this.updateAttendeeStatus(eventId, user, AttendanceStatus.CONFIRMED);
  }

  /**
   * Updates a user's status to 'rejected' for a specific event.
   */
  async rejectEventChange(eventId: string, user: DecodedIdToken): Promise<void> {
    await this.updateAttendeeStatus(eventId, user, AttendanceStatus.REJECTED);
  }

  async update(id: string, updateEventDto: UpdateInternalEventDto) {
    this.logger.log(id);
    this.logger.log(updateEventDto);

    const response = await this.genericService.update(id, updateEventDto);

    this.logger.log(response);

    return response;
  }

  async remove(id: string) {
    return await this.genericService.delete(id);
  }
}

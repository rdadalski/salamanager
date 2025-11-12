import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateInternalEventDto } from './dto/create-event.dto';
import { UpdateInternalEventDto } from './dto/update-event.dto';
import { GenericFirestoreService } from '@app/firebase/generic-firestore.service';
import * as admin from 'firebase-admin';
import { AttendanceStatus, IAttendee, IInternalEvent, IInternalEventFirestore } from '@app/utils/types/event.types';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { FirestoreDate } from '@app/utils/helper.types';
import { convertFromFirestore, convertToFirestore } from '@app/utils/services/dateUtils';

@Injectable()
export class EventsService {
  private genericService: GenericFirestoreService<FirestoreDate<IInternalEvent>>;
  private readonly logger = new Logger(EventsService.name);

  constructor(@Inject('FIREBASE_ADMIN') firebaseAdmin: admin.app.App) {
    this.genericService = new GenericFirestoreService<FirestoreDate<IInternalEvent>>(firebaseAdmin, 'events');
  }

  async create(createEventDto: CreateInternalEventDto) {
    this.logger.log('BEFORE CONVERT:', createEventDto);

    const firestoreData = convertToFirestore(createEventDto);
    this.logger.log('AFTER CONVERT:', firestoreData);

    const response = await this.genericService.create(firestoreData as any);
    this.logger.log('FIRESTORE RESPONSE:', response);

    if (!response) {
      throw new InternalServerErrorException('Failed to create event');
    }

    return response;
  }

  async findAll() {
    return await this.genericService.findAll();
  }

  async findOne(id: string) {
    return await this.genericService.findOne(id);
  }

  async todayEvents(idToken: string) {
    try {
      const decodedToken = await getAuth().verifyIdToken(idToken);
      const uid = decodedToken.uid;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const events = await this.genericService.findByQuery([
        { field: 'trainerId', operator: '==', value: uid },
        { field: 'startTime', operator: '>=', value: Timestamp.fromDate(today) },
        { field: 'endTime', operator: '<', value: Timestamp.fromDate(tomorrow) },
      ]);

      this.logger.log('Found events:', events.length);
      return events;
    } catch (e) {
      this.logger.error('Failed to fetch today events', e);
      throw new InternalServerErrorException('Could not retrieve events');
    }
  }

  async findByGoogleEventId(googleEventId: string) {
    return await this.genericService.findByQuery([{ field: 'googleEventId', operator: '==', value: googleEventId }]);
  }

  async findByGoogleCalendarId(calendarId: string): Promise<IInternalEvent[]> {
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

      this.logger.log(events[0]);

      const mappedEvents = events.map((event) => ({
        ...event,
        startTime: event.startTime.toDate().toISOString(),
        endTime: event.endTime.toDate().toISOString(),
      }));

      this.logger.log(mappedEvents[0]);

      return mappedEvents;
    } catch (error) {
      this.logger.error(`Failed to find events for calendar ${calendarId}:`, {
        error: error.message,
        stack: error.stack,
        calendarId,
      });

      if (error.message.includes('Calendar ID')) {
        throw error;
      }

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
    const firestoreData: Partial<IInternalEventFirestore> = {
      ...updateEventDto,
      ...(updateEventDto.startTime && {
        startTime: Timestamp.fromDate(new Date(updateEventDto.startTime)),
      }),
      ...(updateEventDto.endTime && {
        endTime: Timestamp.fromDate(new Date(updateEventDto.endTime)),
      }),
    };

    const response = await this.genericService.update(id, firestoreData);

    return response;
  }

  async remove(id: string) {
    return await this.genericService.delete(id);
  }
}

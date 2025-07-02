import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateInternalEventDto } from './dto/create-event.dto';
import { UpdateInternalEventDto } from './dto/update-event.dto';
import { GenericFirestoreService } from '@app/firebase/generic-firestore.service';
import * as admin from 'firebase-admin';
import { IInternalEvent } from '@app/utils/types/event.types';

@Injectable()
export class EventsService {
  private genericService: GenericFirestoreService<IInternalEvent>;
  private readonly logger = new Logger(EventsService.name);

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

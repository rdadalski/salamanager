import {
  Controller,
  Get,
  Query,
  Headers,
  Delete,
  Param,
  BadRequestException,
  Post,
  Body,
  Patch,
  Logger,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { ICalendarEvent } from '@app/calendar/interfaces/calendar-event.interface';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateEventDto } from '@app/calendar/dto/create-event.dto';
import { calendar_v3 } from 'googleapis';
import { UpdateEventDto } from '@app/calendar/dto/update-event.dto';
import { SyncService } from '@app/calendar/sync.service';
import { EventsService } from '@app/events/events.service';

@Controller('calendar')
export class CalendarController {
  private readonly logger = new Logger(CalendarController.name);

  constructor(
    private readonly calendarService: CalendarService,
    private readonly syncService: SyncService,
    private readonly eventService: EventsService
  ) {}

  @Get('events')
  @ApiOperation({
    summary: 'List calendar events',
    description: 'Retrieves calendar events based on the provided time range and limits',
  })
  @ApiResponse({
    status: 200,
    description: 'List of calendar events retrieved successfully',
    type: [Object], // Ideally, create a response DTO that matches ICalendarEvent
  })
  @ApiResponse({ status: 400, description: 'Invalid parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'timeMin', required: false, description: 'Start date-time in ISO format' })
  @ApiQuery({ name: 'timeMax', required: false, description: 'End date-time in ISO format' })
  @ApiQuery({ name: 'maxResults', required: false, description: 'Maximum number of events to return' })
  async listEvents(
    @Headers('Authorization') authorization: string,
    @Query('id') id?: string,
    @Query('timeMin') timeMin?: string,
    @Query('timeMax') timeMax?: string,
    @Query('maxResults') maxResults?: number
  ): Promise<ICalendarEvent[]> {
    const idToken = authorization.split('Bearer ')[1];
    return this.calendarService.listEvents(idToken, {
      id,
      timeMin,
      timeMax,
      maxResults: maxResults ? parseInt(maxResults.toString(), 10) : undefined,
    });
  }

  @Get('list')
  @ApiOperation({
    summary: 'Get calendar list',
    description: 'Retrieves the list of calendars for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'List of calendars retrieved successfully',
    type: [Object], // Ideally, create a response DTO that matches the calendar list structure
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async calendarList(@Headers('Authorization') authorization: string): Promise<calendar_v3.Schema$CalendarListEntry[]> {
    const idToken = authorization.split('Bearer ')[1];
    return this.calendarService.getCalendarList(idToken);
  }

  @Post('events')
  @ApiOperation({
    summary: 'Create calendar event',
    description: 'Creates a new calendar event with the provided details',
  })
  @ApiResponse({
    status: 201,
    description: 'Calendar event created successfully',
    type: Object, // Ideally replace with event response DTO
  })
  @ApiResponse({ status: 400, description: 'Invalid event data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: CreateEventDto })
  async createEvent(
    @Headers('Authorization') authorization: string,
    @Body() createEventDto: CreateEventDto
  ): Promise<calendar_v3.Schema$Event> {
    if (!authorization) {
      throw new BadRequestException('Authorization header is required');
    }
    const idToken = authorization.replace('Bearer ', '');
    return this.calendarService.createEvent(idToken, createEventDto);
  }

  @Patch('events/:eventId')
  @ApiOperation({
    summary: 'Update calendar event',
    description: 'Updates an existing calendar event with the provided details',
  })
  @ApiResponse({
    status: 200,
    description: 'Calendar event updated successfully',
    type: Object, // Ideally replace with event response DTO
  })
  @ApiResponse({ status: 400, description: 'Invalid event data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiParam({ name: 'eventId', description: 'The ID of the event to update' })
  @ApiBody({ type: UpdateEventDto })
  async updateEvent(
    @Headers('Authorization') authorization: string,
    @Param('eventId') eventId: string,
    @Body() updateEventDto: UpdateEventDto
  ): Promise<{ success: boolean; data: calendar_v3.Schema$Event }> {
    if (!authorization) {
      throw new BadRequestException('Authorization header is required');
    }

    const idToken = authorization.replace('Bearer ', '');

    try {
      const firebaseUpdateResult = await this.eventService.update(eventId, {
        startTime: updateEventDto.start.dateTime,
        endTime: updateEventDto.end.dateTime,
      });

      this.logger.log(firebaseUpdateResult);
    } catch (error) {
      this.logger.warn(`updating firebase doc error: ${error}`);
    }

    return await this.calendarService.updateEvent(idToken, eventId, updateEventDto);
  }

  @Delete('events/:eventId')
  @ApiOperation({
    summary: 'Delete calendar event',
    description: 'Deletes an existing calendar event',
  })
  @ApiResponse({
    status: 200,
    description: 'Calendar event deleted successfully',
    schema: { type: 'object', properties: { success: { type: 'boolean' } } },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiParam({ name: 'eventId', description: 'The ID of the event to delete' })
  async deleteEvent(
    @Headers('Authorization') authorization: string,
    @Param('eventId') eventId: string
  ): Promise<{ success: boolean }> {
    if (!authorization) {
      throw new BadRequestException('Authorization header is required');
    }

    const idToken = authorization.replace('Bearer ', '');

    const result = await this.calendarService.deleteEvent(idToken, eventId);
    return { success: result };
  }

  @Post('sync')
  async syncCalendar(@Body() body: { calendarId: string; accessToken: string }) {
    try {
      this.logger.log(`Starting sync for calendar: ${body.calendarId}`);
      const events = await this.calendarService.syncCalendarEvents(body.calendarId, body.accessToken);

      return {
        success: true,
        message: `Synced ${events.length} events`,
        eventsCount: events.length,
      };
    } catch (error) {
      this.logger.error('Sync failed:', error);
      return {
        success: false,
        message: 'Sync failed',
        error: error.message,
      };
    }
  }

  @Get('events/:calendarId')
  async getEvents(@Param('calendarId') calendarId: string) {
    try {
      const events = await this.syncService.getEventsByCalendar(calendarId);

      return {
        success: true,
        events: events,
        count: events.length,
      };
    } catch (error) {
      this.logger.error('Failed to get events:', error);
      return {
        success: false,
        message: 'Failed to get events',
        error: error.message,
      };
    }
  }

  @Get('sync-status/:calendarId')
  async getSyncStatus(@Param('calendarId') calendarId: string) {
    try {
      const metadata = await this.syncService.getSyncMetadata(calendarId);

      return {
        success: true,
        syncStatus: {
          isInitialSyncComplete: metadata?.isInitialSyncComplete || false,
          lastSyncTime: metadata?.lastSyncTime,
          hasSyncToken: !!metadata?.syncToken,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get sync status',
        error: error.message,
      };
    }
  }

  @Post('test-sync')
  async testSync(
    @Headers('Authorization') authorization: string,
    @Body() body: { calendarId: string; forceFullSync?: boolean }
  ) {
    const idToken = authorization.split('Bearer ')[1];
    try {
      this.logger.log('=== SYNC TEST STARTED ===');

      // Optional: Force full sync by clearing metadata
      // if (body.forceFullSync) {
      //   await this.syncService.saveSyncMetadata({
      //     calendarId: body.calendarId,
      //     lastSyncTime: new Date(),
      //     isInitialSyncComplete: false,
      //   });
      //   this.logger.log('Forced full sync mode');
      // }

      // Get sync status before
      const beforeSync = await this.syncService.getSyncMetadata(body.calendarId);
      this.logger.log('Before sync:', {
        hasToken: !!beforeSync?.syncToken,
        lastSync: beforeSync?.lastSyncTime,
        isComplete: beforeSync?.isInitialSyncComplete,
      });

      // Perform sync
      const events = await this.calendarService.syncCalendarEvents(body.calendarId, idToken);

      // Get sync status after
      const afterSync = await this.syncService.getSyncMetadata(body.calendarId);

      // Get saved events from Firebase
      const savedEvents = await this.syncService.getEventsByCalendar(body.calendarId);

      this.logger.log('=== SYNC TEST COMPLETED ===');

      return {
        success: true,
        testResults: {
          syncedEventsCount: events.length,
          totalEventsInFirebase: savedEvents.length,
          beforeSync: {
            hadSyncToken: !!beforeSync?.syncToken,
            lastSyncTime: beforeSync?.lastSyncTime,
            wasInitialComplete: beforeSync?.isInitialSyncComplete,
          },
          afterSync: {
            hasSyncToken: !!afterSync?.syncToken,
            lastSyncTime: afterSync?.lastSyncTime,
            isInitialComplete: afterSync?.isInitialSyncComplete,
          },
          fullRes: events,
          sampleEvents: savedEvents.slice(0, 3).map((event) => ({
            id: event.googleEventId,
            title: event.summary,
            start: event.startTime,
            end: event.endTime,
          })),
        },
      };
    } catch (error) {
      this.logger.error('=== SYNC TEST FAILED ===', error);
      return {
        success: false,
        error: error.message,
        stack: error.stack,
      };
    }
  }
}

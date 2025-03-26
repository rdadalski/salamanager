import { Controller, Get, Query, Headers, Delete, Param, BadRequestException, Post, Body, Patch } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { ICalendarEvent } from '@app/calendar/interfaces/calendar-event.interface';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateEventDto } from '@app/calendar/dto/create-event.dto';
import { calendar_v3 } from 'googleapis';
import { UpdateEventDto } from '@app/calendar/dto/update-event.dto';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

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
    @Query('timeMin') timeMin?: string,
    @Query('timeMax') timeMax?: string,
    @Query('maxResults') maxResults?: number
  ): Promise<ICalendarEvent[]> {
    const idToken = authorization.split('Bearer ')[1];
    return this.calendarService.listEvents(idToken, {
      timeMin,
      timeMax,
      maxResults: maxResults ? parseInt(maxResults.toString(), 10) : undefined,
    });
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
  ): Promise<calendar_v3.Schema$Event> {
    if (!authorization) {
      throw new BadRequestException('Authorization header is required');
    }

    const idToken = authorization.replace('Bearer ', '');

    return this.calendarService.updateEvent(idToken, eventId, updateEventDto);
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
}

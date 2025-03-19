import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers, UseGuards } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { ICalendarEvent } from '@app/calendar/interfaces/calendar-event.interface';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('events')
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
}

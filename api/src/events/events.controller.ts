import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, BadRequestException } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateInternalEventDto } from './dto/create-event.dto';
import { UpdateInternalEventDto } from './dto/update-event.dto';
import { CalendarService } from '@app/calendar/calendar.service';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly calendarService: CalendarService
  ) {}

  @Post()
  create(@Body() createEventDto: CreateInternalEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get('calendar/:id')
  findEventsByCalendarId(@Param('id') id: string) {
    return this.eventsService.findByGoogleCalendarId(id);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':eventId')
  async update(
    @Headers('Authorization') authorization: string,
    @Param('eventId') eventId: string,
    @Body() updateEventDto: UpdateInternalEventDto
  ) {
    if (!authorization) {
      throw new BadRequestException('Authorization header is required');
    }

    const idToken = authorization.replace('Bearer ', '');

    return await this.eventsService.update(eventId, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}

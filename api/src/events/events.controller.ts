import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateInternalEventDto } from './dto/create-event.dto';
import { UpdateInternalEventDto } from './dto/update-event.dto';
import { FirebaseAuthGuard } from '@app/utils/guards/firebase-auth.guard';
import { RolesGuard } from '@app/utils/guards/role.guard';
import { Roles } from '@app/utils/decorators/roles.decorator';
import { UserRole } from '@app/user/models/user.model';
import { User } from '@app/utils/decorators/user.decorator';
import { DecodedIdToken } from 'firebase-admin/auth';
import { Token } from '@app/utils/decorators/token.decorator';

@Controller('events')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // TODO change roles before shipping

  @Post()
  @Roles(UserRole.TRAINER, UserRole.CLIENT, UserRole.ADMIN)
  create(@Body() createEventDto: CreateInternalEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get('today')
  @Roles()
  today(@Token() token: string) {
    return this.eventsService.todayEvents(token);
  }

  @Get('calendar/:id')
  findEventsByCalendarId(@Param('id') id: string) {
    return this.eventsService.findByGoogleCalendarId(id);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.TRAINER)
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':eventId')
  @Roles(UserRole.TRAINER, UserRole.CLIENT, UserRole.ADMIN)
  async update(@Param('eventId') eventId: string, @Body() updateEventDto: UpdateInternalEventDto) {
    return await this.eventsService.update(eventId, updateEventDto);
  }

  /**
   * Endpoint for a user to accept a proposed event time change.
   */
  @Post(':eventId/accept')
  @HttpCode(HttpStatus.NO_CONTENT)
  async acceptEventChange(
    @Param('eventId') eventId: string,
    @User() user: DecodedIdToken // Injects the authenticated user object
  ) {
    await this.eventsService.acceptEventChange(eventId, user);
  }

  /**
   * Endpoint for a user to reject a proposed event time change.
   * This will remove them from the event.
   */
  @Post(':eventId/reject')
  @HttpCode(HttpStatus.NO_CONTENT)
  async rejectEventChange(
    @Param('eventId') eventId: string,
    @User() user: DecodedIdToken // Injects the authenticated user object
  ) {
    await this.eventsService.rejectEventChange(eventId, user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}

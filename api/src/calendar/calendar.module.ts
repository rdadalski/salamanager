import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { UserService } from '@app/user/user.service';
import { EventsService } from '@app/events/events.service';
import { SyncService } from '@app/calendar/sync.service';

@Module({
  controllers: [CalendarController],
  providers: [CalendarService, UserService, EventsService, SyncService],
  exports: [CalendarService],
})
export class CalendarModule {}

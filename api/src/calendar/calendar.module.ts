import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { SyncService } from '@app/calendar/sync.service';
import { UserModule } from '@app/user/user.module';
import { EventsModule } from '@app/events/events.module';

@Module({
  controllers: [CalendarController],
  imports: [UserModule, EventsModule],
  providers: [CalendarService, SyncService],
  exports: [CalendarService, SyncService],
})
export class CalendarModule {}

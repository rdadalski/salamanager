import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { UserService } from '@app/user/user.service';

@Module({
  controllers: [CalendarController],
  providers: [CalendarService, UserService],
  exports: [CalendarService],
})
export class CalendarModule {}

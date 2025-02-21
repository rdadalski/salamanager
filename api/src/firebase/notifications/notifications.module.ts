import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { FirebaseModule } from '@app/firebase/firebase.module';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [FirebaseModule.forRoot()],
  providers: [NotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}

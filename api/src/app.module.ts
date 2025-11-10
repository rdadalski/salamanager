import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { FirebaseService } from './firebase/firebase.service';
import { FirebaseController } from './firebase/firebase.controller';
import { NotificationsModule } from './firebase/notifications/notifications.module';
import { AuthModule } from './auth/auth.module';
import { GoogleAuthModule } from './google-auth/google-auth.module';
import { UserModule } from './user/user.module';
import { CalendarModule } from './calendar/calendar.module';
import { ResourceModule } from './resource/resource.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['config/.env'] }),
    FirebaseModule.forRoot(),
    NotificationsModule,
    AuthModule,
    GoogleAuthModule,
    UserModule,
    CalendarModule,
    ResourceModule,
    EventsModule,
  ],
  controllers: [AppController, FirebaseController],
  providers: [AppService, FirebaseService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { FirebaseService } from './firebase/firebase.service';
import { FirebaseController } from './firebase/firebase.controller';
import { TestGenericModule } from './test-generic/test-generic.module';
import { TestGenericController } from './test-generic/test-generic.controller';
import { NotificationsModule } from './firebase/notifications/notifications.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['config/.env'] }),
    FirebaseModule.forRoot(),
    TestGenericModule,
    NotificationsModule,
    AuthModule,
  ],
  controllers: [AppController, FirebaseController],
  providers: [AppService, FirebaseService],
})
export class AppModule {}

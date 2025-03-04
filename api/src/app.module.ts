import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { FirebaseService } from './firebase/firebase.service';
import { FirebaseController } from './firebase/firebase.controller';
import { TestGenericModule } from './test-generic/test-generic.module';
import { NotificationsModule } from './firebase/notifications/notifications.module';
import { AuthModule } from './auth/auth.module';
import { GoogleAuthModule } from './google-auth/google-auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['config/.env'] }),
    FirebaseModule.forRoot(),
    TestGenericModule,
    NotificationsModule,
    AuthModule,
    GoogleAuthModule,
    UserModule,
  ],
  controllers: [AppController, FirebaseController],
  providers: [AppService, FirebaseService],
})
export class AppModule {}

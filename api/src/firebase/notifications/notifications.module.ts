import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { FirebaseModule } from '@app/firebase/firebase.module';
import { NotificationsController } from './notifications.controller';
import { UserTokenService } from '@app/firebase/notifications/userToken.service';
import { GenericFirestoreService } from '@app/firebase/generic-firestore.service';
import { UserToken } from '@app/firebase/notifications/models/user-token.model';

@Module({
  imports: [FirebaseModule.forRoot()],
  providers: [
    NotificationsService,
    UserTokenService,
    {
      provide: 'USER_TOKEN_FIRESTORE_SERVICE',
      useFactory: (firebaseAdmin) => {
        return new GenericFirestoreService<UserToken>(firebaseAdmin, 'user_tokens');
      },
      inject: ['FIREBASE_ADMIN'],
    },
  ],
  controllers: [NotificationsController],
  exports: [NotificationsService, UserTokenService],
})
export class NotificationsModule {}

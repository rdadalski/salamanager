import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { GenericFirestoreService } from '@app/firebase/generic-firestore.service';
import { UserToken } from '@app/firebase/notifications/interfaces/user-token.model';
import { NotificationsModule } from '@app/firebase/notifications/notifications.module';

@Module({
  controllers: [UserController],
  imports: [NotificationsModule],
  providers: [
    UserService,
    {
      provide: 'USER_FIRESTORE_SERVICE',
      useFactory: (firebaseAdmin) => {
        return new GenericFirestoreService<UserToken>(firebaseAdmin, 'users');
      },
      inject: ['FIREBASE_ADMIN'],
    },
  ],
  exports: [UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { GenericFirestoreService } from '@app/firebase/generic-firestore.service';
import { UserToken } from '@app/firebase/notifications/models/user-token.model';

@Module({
  controllers: [UserController],
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
})
export class UserModule {}

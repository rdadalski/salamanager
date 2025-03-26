import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GenericFirestoreService } from '@app/firebase/generic-firestore.service';
import { UserToken } from '@app/firebase/notifications/interfaces/user-token.model';
import { UserService } from '@app/user/user.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
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
export class AuthModule {}

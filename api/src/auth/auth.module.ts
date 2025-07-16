import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GenericFirestoreService } from '@app/firebase/generic-firestore.service';
import { UserToken } from '@app/firebase/notifications/interfaces/user-token.model';
import { UserModule } from '@app/user/user.module';

@Module({
  controllers: [AuthController],
  imports: [UserModule],
  providers: [
    AuthService,
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

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserToken } from '@app/firebase/notifications/interfaces/user-token.model';
import { UserModule } from '@app/user/user.module';
import { createFirestoreProvider } from '@app/firebase/utils/firebase.provider';
import { FIRESTORE_COLLECTIONS } from '@app/firebase/utils/firebase.constants';

@Module({
  controllers: [AuthController],
  imports: [UserModule],
  providers: [AuthService, createFirestoreProvider<UserToken>(FIRESTORE_COLLECTIONS.USERS)],
})
export class AuthModule {}

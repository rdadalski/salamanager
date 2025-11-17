import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserToken } from '@app/firebase/notifications/interfaces/user-token.model';
import { NotificationsModule } from '@app/firebase/notifications/notifications.module';
import { createFirestoreProvider } from '@app/firebase/utils/firebase.provider';
import { FIRESTORE_COLLECTIONS } from '@app/firebase/utils/firebase.constants';

@Module({
  controllers: [UserController],
  imports: [NotificationsModule],
  providers: [UserService, createFirestoreProvider<UserToken>(FIRESTORE_COLLECTIONS.USERS)],
  exports: [UserService],
})
export class UserModule {}

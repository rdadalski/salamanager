import { Module } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { GoogleAuthController } from './google-auth.controller';
import { FirebaseModule } from '@app/firebase/firebase.module';

import { defineSecret } from 'firebase-functions/params';
export const webClientId = defineSecret('WEB_CLIENT_ID');

console.log(webClientId);

@Module({
  imports: [FirebaseModule.forRoot()],
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService],
})
export class GoogleAuthModule {}

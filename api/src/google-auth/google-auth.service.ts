import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { app } from 'firebase-admin';
import { webClientId } from '@app/google-auth/google-auth.module';

@Injectable()
export class GoogleAuthService {
  private readonly logger = new Logger(GoogleAuthService.name);
  constructor(@Inject('FIREBASE_ADMIN') private firebaseAdmin: app.App) {}

  async getGoogleConfig() {
    try {
      if (!webClientId) {
        throw new InternalServerErrorException('Google client configuration is missing');
      }

      const cleanWebClientId = webClientId.value().replace(/^"|"$/g, '');

      return {
        webclientId: cleanWebClientId,
        scopes: [
          'openid',
          'email',
          'profile',
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/calendar.readonly',
          'https://www.googleapis.com/auth/calendar.events',
        ],
      };
    } catch (e) {
      const error = e as Error;

      this.logger.error(error.message);
    }
  }
}

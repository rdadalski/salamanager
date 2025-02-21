import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { app } from 'firebase-admin';
import { webClientId } from '@app/google-auth/google-auth.module';

@Injectable()
export class GoogleAuthService {
  constructor(@Inject('FIREBASE_ADMIN') private firebaseAdmin: app.App) {}

  async getGoogleConfig() {
    if (!webClientId) {
      throw new InternalServerErrorException('Google client configuration is missing');
    }

    const cleanWebClientId = webClientId.value().replace(/^"|"$/g, '');

    return {
      webclientId: cleanWebClientId,
      scopes: ['openid', 'email', 'profile'],
    };
  }
}

// @Injectable()
// export class GoogleAuthService {
//   constructor(
//     @Inject('FIREBASE_ADMIN') private firebaseAdmin: app.App,
//     private httpService: HttpService
//   ) {}
//
//   async getGoogleConfig() {
//     const response = await firstValueFrom(this.httpService.get<GoogleConfig>(this.firebaseFunctionUrl));
//
//     this.googleClientId = response.data.clientId;
//     const googleResponse: Response = await fetch('http://127.0.0.1:5001/salamanager-1fa72/us-central1/getGoogleConfig');
//
//     if (!googleResponse) {
//       throw new InternalServerErrorException('Google client configuration is missing');
//     }
//
//     return {
//       webclientId: googleResponse.body,
//       scopes: ['openid', 'email', 'profile'],
//     };
//   }
// }

// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
// import { firstValueFrom } from 'rxjs';
// import { ConfigService } from '@nestjs/config';
//
// interface GoogleConfig {
//   clientId: string;
// }
//
// @Injectable()
// export class GoogleConfigService implements OnModuleInit {
//   private googleClientId: string;
//   private readonly firebaseFunctionUrl: string;
//
//   constructor(
//     private readonly httpService: HttpService,
//     private readonly configService: ConfigService,
//   ) {
//     // Get the Firebase Function URL from environment variables
//     this.firebaseFunctionUrl = this.configService.get<string>('FIREBASE_FUNCTION_URL');
//   }
//
//   async onModuleInit() {
//     // Fetch the Google client ID when the module initializes
//     await this.fetchGoogleConfig();
//   }
//
//   private async fetchGoogleConfig(): Promise<void> {
//     try {
//       const response = await firstValueFrom(
//         this.httpService.get<GoogleConfig>(this.firebaseFunctionUrl)
//       );
//
//       this.googleClientId = response.data.clientId;
//     } catch (error) {
//       console.error('Failed to fetch Google config:', error);
//       throw error;
//     }
//   }
//
//   getGoogleClientId(): string {
//     if (!this.googleClientId) {
//       throw new Error('Google client ID not initialized');
//     }
//     return this.googleClientId;
//   }
// }

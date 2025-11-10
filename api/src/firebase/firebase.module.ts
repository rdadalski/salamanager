import { Module, DynamicModule } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirebaseService } from './firebase.service';
import * as credentials from '../../config/firebase.json';

@Module({
  imports: [ConfigModule],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {
  private static firebaseApp: admin.app.App;

  static forRoot(): DynamicModule {
    return {
      module: FirebaseModule,
      providers: [FirebaseService, this.createFirebaseAdminProvider()],
      exports: ['FIREBASE_ADMIN', FirebaseService],
      global: true,
    };
  }

  private static createFirebaseAdminProvider() {
    return {
      provide: 'FIREBASE_ADMIN',
      useFactory: async (configService: ConfigService) => {
        return this.initializeFirebaseAdmin();
      },
      inject: [ConfigService],
    };
  }

  private static initializeFirebaseAdmin(): admin.app.App {
    if (admin.apps.length) {
      return admin.app();
    }

    if (process.env.FUNCTIONS_EMULATOR === 'true') {
      console.log('[FirebaseModule] Emulator detected. Initializing without credentials.');
      // When in the emulator, initialize without any arguments.
      // The Admin SDK will automatically connect to the local services.
      return admin.initializeApp();
    } else {
      // Production or other deployed environments: Use the service account credentials
      console.log('[FirebaseModule] Production environment detected. Initializing with credentials.');

      if (!credentials) {
        throw new Error('Firebase credentials are required for non-emulator environments but were not found.');
      }

      const serviceAccount = {
        projectId: credentials.project_id,
        privateKey: credentials.private_key,
        clientEmail: credentials.client_email,
      };

      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.projectId}.firebaseio.com`,
      });
    }
  }

  static getFirebaseApp(): admin.app.App {
    return this.firebaseApp;
  }
}

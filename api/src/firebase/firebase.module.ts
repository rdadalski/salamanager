import { Module, DynamicModule } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirebaseService } from './firebase.service';
import * as credentials from 'config/firebase.json';

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
    if (!this.firebaseApp) {
      console.log('Initializing Firebase app');
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(credentials as admin.ServiceAccount),
        databaseURL: `https://${credentials.project_id}.firebaseio.com`,
        storageBucket: `${credentials.project_id}.appspot.com`,
      });
    }
    return this.firebaseApp;
  }

  static getFirebaseApp(): admin.app.App {
    return this.firebaseApp;
  }
}

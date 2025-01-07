import { Module, DynamicModule } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { FirebaseService } from './firebase.service';
import * as credentials from 'config/firebase.json';

@Module({
  imports: [ConfigModule],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {
  static forRoot(): DynamicModule {
    return {
      module: FirebaseModule,
      providers: [this.createFirebaseAdminProvider()],
      exports: ['FIREBASE_ADMIN'],
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
    return admin.initializeApp({
      credential: admin.credential.cert(credentials as admin.ServiceAccount),
      databaseURL: `https://${credentials.project_id}.firebaseio.com`,
      storageBucket: `${credentials.project_id}.appspot.com`,
    });
  }
}

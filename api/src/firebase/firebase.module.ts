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
      providers: [
        {
          provide: 'FIREBASE_ADMIN',
          useFactory: async (configService: ConfigService) => {
            const app = admin.initializeApp({
              credential: admin.credential.cert(
                credentials as admin.ServiceAccount,
              ),
              databaseURL: `https://${credentials.project_id}.firebaseio.com`,
              storageBucket: `${credentials.project_id}.appspot.com`,
            });
            return app;
          },
          inject: [ConfigService],
        },
      ],
      exports: ['FIREBASE_ADMIN'],
    };
  }
}

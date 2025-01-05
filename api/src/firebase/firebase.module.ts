import { Module, DynamicModule } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
})
export class FirebaseModule {
  static forRoot(): DynamicModule {
    return {
      module: FirebaseModule,
      providers: [
        {
          provide: 'FIREBASE_ADMIN',
          useFactory: async (configService: ConfigService) => {
            const { privateKey } = JSON.parse(
              configService.get<string>('FIREBASE_PRIVATE_KEY'),
            );

            console.log(privateKey);

            const serviceAccount = {
              type: configService.get<string>('FIREBASE_TYPE'),
              project_id: configService.get<string>('FIREBASE_PROJECT_ID'),
              private_key_id: configService.get<string>(
                'FIREBASE_PRIVATE_KEY_ID',
              ),
              private_key: privateKey,
              client_email: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
              client_id: configService.get<string>('FIREBASE_CLIENT_ID'),
              auth_uri: configService.get<string>('FIREBASE_AUTH_URI'),
              token_uri: configService.get<string>('FIREBASE_TOKEN_URI'),
              auth_provider_x509_cert_url: configService.get<string>(
                'FIREBASE_AUTH_PROVIDER_X509_CERT_URL',
              ),
              client_x509_cert_url: configService.get<string>(
                'FIREBASE_CLIENT_X509_CERT_URL',
              ),
            };

            admin.initializeApp({
              credential: admin.credential.cert(
                serviceAccount as admin.ServiceAccount,
              ),
            });
          },
          inject: [ConfigService],
        },
      ],
      exports: ['FIREBASE_ADMIN'],
    };
  }
}

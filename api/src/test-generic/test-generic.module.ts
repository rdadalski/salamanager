import { Module } from '@nestjs/common';
import { TestGenericService } from './test-generic.service';
import { TestGenericController } from './test-generic.controller';
import { GenericFirestoreService } from '@app/firebase/generic-firestore.service';
import { app } from 'firebase-admin';
import { FirebaseModule } from '@app/firebase/firebase.module';

@Module({
  imports: [FirebaseModule.forRoot()],
  controllers: [TestGenericController],
  providers: [
    TestGenericService,
    {
      provide: GenericFirestoreService,
      useFactory: (firebaseAdmin: app.App) =>
        new GenericFirestoreService<any>(firebaseAdmin, 'TestGenericCrud'),
      inject: ['FIREBASE_ADMIN'],
    },
  ],
})
export class TestGenericModule {}

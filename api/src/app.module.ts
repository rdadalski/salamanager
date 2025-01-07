import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { FirebaseService } from './firebase/firebase.service';
import { FirebaseController } from './firebase/firebase.controller';
import { TestGenericModule } from './test-generic/test-generic.module';
import { GenericFirestoreService } from './firebase/generic-firestore.service';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['config/.env'] }),
    FirebaseModule.forRoot(),
    TestGenericModule,
  ],
  controllers: [AppController, FirebaseController],
  providers: [AppService, FirebaseService, GenericFirestoreService],
})
export class AppModule {}

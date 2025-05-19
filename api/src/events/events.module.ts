import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { GenericFirestoreService } from '@app/firebase/generic-firestore.service';

@Module({
  controllers: [EventsController],
  providers: [
    EventsService,
    {
      provide: 'EVENTS_FIRESTORE_SERVICE',
      useFactory: (firebaseAdmin) => {
        return new GenericFirestoreService<IInternalEvent>(firebaseAdmin, 'resources');
      },
      inject: ['FIREBASE_ADMIN'],
    },
  ],
})
export class EventsModule {}

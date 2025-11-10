import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { GenericFirestoreService } from '@app/firebase/generic-firestore.service';
import { IInternalEvent } from '@app/utils/types';

@Module({
  controllers: [EventsController],
  providers: [
    EventsService,
    {
      provide: 'EVENTS_FIRESTORE_SERVICE',
      useFactory: (firebaseAdmin) => {
        return new GenericFirestoreService<IInternalEvent>(firebaseAdmin, 'events');
      },
      inject: ['FIREBASE_ADMIN'],
    },
  ],
  exports: [EventsService],
})
export class EventsModule {}

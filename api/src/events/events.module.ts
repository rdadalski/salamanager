import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { IInternalEvent } from '@app/utils/types';
import { createFirestoreProvider } from '@app/firebase/utils/firebase.provider';
import { FIRESTORE_COLLECTIONS } from '@app/firebase/utils/firebase.constants';

@Module({
  controllers: [EventsController],
  providers: [EventsService, createFirestoreProvider<IInternalEvent>(FIRESTORE_COLLECTIONS.EVENTS)],
  exports: [EventsService],
})
export class EventsModule {}

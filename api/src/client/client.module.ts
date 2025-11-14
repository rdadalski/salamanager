import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { createFirestoreProvider } from '@app/firebase/utils/firebase.provider';
import { FIRESTORE_COLLECTIONS } from '@app/firebase/utils/firebase.constants';
import { IClient } from '@app/client/types/client.types';

@Module({
  controllers: [ClientController],
  providers: [ClientService, createFirestoreProvider<IClient>(FIRESTORE_COLLECTIONS.CLIENTS)],
  exports: [ClientService],
})
export class ClientModule {}

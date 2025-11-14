import { Module } from '@nestjs/common';
import { ResourceController } from './resource.controller';
import { IResource } from '@app/utils/types/resource.types';
import { ResourceService } from '@app/resource/resource.service';
import { createFirestoreProvider } from '@app/firebase/utils/firebase.provider';
import { FIRESTORE_COLLECTIONS } from '@app/firebase/utils/firebase.constants';

@Module({
  controllers: [ResourceController],
  providers: [ResourceService, createFirestoreProvider<IResource>(FIRESTORE_COLLECTIONS.RESOURCES)],
  exports: [ResourceService],
})
export class ResourceModule {}

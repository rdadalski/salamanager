import { Module } from '@nestjs/common';
import { ResourceController } from './resource.controller';
import { GenericFirestoreService } from '@app/firebase/generic-firestore.service';
import { IResource } from '@app/utils/types/resource.types';
import { ResourceService } from '@app/resource/resource.service';

@Module({
  controllers: [ResourceController],
  providers: [
    ResourceService,
    {
      provide: 'RESOURCE_FIRESTORE_SERVICE',
      useFactory: (firebaseAdmin) => {
        return new GenericFirestoreService<IResource>(firebaseAdmin, 'resources');
      },
      inject: ['FIREBASE_ADMIN'],
    },
  ],
  exports: [ResourceService],
})
export class ResourceModule {}

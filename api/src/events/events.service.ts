import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateInternalEventDto } from './dto/create-event.dto';
import { UpdateInternalEventDto } from './dto/update-event.dto';
import { GenericFirestoreService } from '@app/firebase/generic-firestore.service';
import * as admin from 'firebase-admin';
import { IInternalEvent } from '@app/utils/types/event.types';

@Injectable()
export class EventsService {
  private genericService: GenericFirestoreService<IInternalEvent>;
  private readonly logger = new Logger(EventsService.name);

  constructor(@Inject('FIREBASE_ADMIN') firebaseAdmin: admin.app.App) {
    this.genericService = new GenericFirestoreService<IInternalEvent>(firebaseAdmin, 'events');
  }

  async create(createEventDto: CreateInternalEventDto) {
    const response = await this.genericService.create(createEventDto);

    this.logger.log(response);
    // TODO there is always something to do
    //  like error handling
    return response;
  }

  async findAll() {
    return await this.genericService.findAll();
  }

  async findOne(id: string) {
    return await this.genericService.findOne(id);
  }

  async findByGoogleEventId(googleEventId: string) {
    return await this.genericService.findByQuery([
      { field: 'googleEventId', operator: '==', value: googleEventId }
    ]);
  }

  async update(id: string, updateEventDto: UpdateInternalEventDto) {
    const response = await this.genericService.update(id, updateEventDto);

    this.logger.log(response);

    return response;
  }

  async remove(id: string) {
    return await this.genericService.delete(id);
  }
}

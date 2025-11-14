import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { GenericFirestoreService } from '@app/firebase/generic-firestore.service';
import { IResource } from '@app/utils/types/resource.types';
import { getFirestoreToken } from '@app/firebase/utils/firebase.provider';
import { FIRESTORE_COLLECTIONS } from '@app/firebase/utils/firebase.constants';

@Injectable()
export class ResourceService {
  private readonly logger = new Logger(ResourceService.name);

  constructor(
    @Inject(getFirestoreToken(FIRESTORE_COLLECTIONS.RESOURCES))
    private readonly genericService: GenericFirestoreService<IResource>
  ) {}

  async create(createResourceDto: CreateResourceDto) {
    const response = await this.genericService.create(createResourceDto);
    this.logger.log(response);
    return response;
  }

  async createBulk(createResourceDtoBulk: CreateResourceDto[]) {
    return await this.genericService.createBulk(createResourceDtoBulk, (r) => r.googleEventId);
  }

  async findAll() {
    return await this.genericService.findAll();
  }

  async findOne(id: string) {
    return await this.genericService.findOne(id);
  }

  async update(id: string, updateResourceDto: UpdateResourceDto) {
    return await this.genericService.update(id, updateResourceDto);
  }

  async remove(id: string) {
    return await this.genericService.delete(id);
  }
}

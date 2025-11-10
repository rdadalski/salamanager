import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { GenericFirestoreService } from '@app/firebase/generic-firestore.service';
import { IResource } from '@app/utils/types/resource.types';

@Injectable()
export class ResourceService {
  private readonly logger = new Logger(ResourceService.name);

  constructor(
    @Inject('RESOURCE_FIRESTORE_SERVICE')
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

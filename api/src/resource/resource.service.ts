import { Inject, Injectable, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
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
    try {
      return await this.genericService.create({ ...createResourceDto, configured: false });
    } catch (e) {
      this.logger.error('Failed to create resource', e);
      throw new InternalServerErrorException('Failed to create resource');
    }
  }

  async createBulk(createResourceDtoBulk: CreateResourceDto[]) {
    try {
      return await this.genericService.createBulk(createResourceDtoBulk, (r) => r.googleEventId);
    } catch (e) {
      this.logger.error('Failed to create bulk resources', e);
      throw new InternalServerErrorException('Failed to create bulk resources');
    }
  }

  async findAll() {
    try {
      return await this.genericService.findAll();
    } catch (e) {
      this.logger.error('Failed to fetch resources', e);
      throw new InternalServerErrorException('Failed to fetch resources');
    }
  }

  async findOne(id: string) {
    try {
      const resource = await this.genericService.findOne(id);
      if (!resource) {
        throw new NotFoundException(`Resource with id ${id} not found`);
      }
      return resource;
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      this.logger.error(`Failed to fetch resource ${id}`, e);
      throw new InternalServerErrorException('Failed to fetch resource');
    }
  }

  async findByTrainerId(id: string) {
    try {
      return await this.genericService.findByQuery([{ field: 'trainerId', operator: '==', value: id }]);
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      this.logger.error(`Failed to fetch resource ${id}`, e);
      throw new InternalServerErrorException('Failed to fetch resource');
    }
  }

  async update(id: string, updateResourceDto: UpdateResourceDto) {
    try {
      const configured = (updateResourceDto.defaultPrice ?? 0) !== 0 && (updateResourceDto.clients?.length ?? 0) > 0;
      return await this.genericService.update(id, { ...updateResourceDto, configured: configured });
    } catch (e) {
      this.logger.error(`Failed to update resource ${id}`, e);
      throw new InternalServerErrorException('Failed to update resource');
    }
  }

  async remove(id: string) {
    try {
      return await this.genericService.delete(id);
    } catch (e) {
      this.logger.error(`Failed to delete resource ${id}`, e);
      throw new InternalServerErrorException('Failed to delete resource');
    }
  }
}

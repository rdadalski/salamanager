import { ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { GenericFirestoreService } from '@app/firebase/generic-firestore.service';
import { getFirestoreToken } from '@app/firebase/utils/firebase.provider';
import { FIRESTORE_COLLECTIONS } from '@app/firebase/utils/firebase.constants';
import { IClient } from '@app/client/types/client.types';
import { Timestamp } from 'firebase-admin/firestore';
import { UserRole } from '@app/user/models/user.model';

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);

  constructor(
    @Inject(getFirestoreToken(FIRESTORE_COLLECTIONS.CLIENTS))
    private readonly clientFirestore: GenericFirestoreService<IClient>
  ) {}

  async create(createClientDto: CreateClientDto, trainerId: string): Promise<string> {
    const clientData: IClient = {
      ...createClientDto,
      trainerId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'pending',
    };

    return await this.clientFirestore.create(clientData);
  }

  async findAll(): Promise<IClient[]> {
    return await this.clientFirestore.findAll();
  }

  async findOne(id: string, requestingUserId?: string, requestingUserRole?: UserRole): Promise<IClient | null> {
    const client = await this.clientFirestore.findOne(id);

    if (!client) {
      return null;
    }

    if (requestingUserRole === UserRole.CLIENT && client.userId !== requestingUserId) {
      throw new ForbiddenException('You can only view your own profile');
    }

    if (requestingUserRole === UserRole.TRAINER && client.trainerId !== requestingUserId) {
      throw new ForbiddenException('You can only view your own clients');
    }

    return client;
  }

  async findByUserId(userId: string): Promise<IClient | null> {
    const clients = await this.clientFirestore.findByQuery([{ field: 'userId', operator: '==', value: userId }]);
    return clients[0] || null;
  }

  async findByTrainerId(trainerId: string): Promise<IClient[]> {
    this.logger.log(trainerId);

    return await this.clientFirestore.findByQuery([{ field: 'trainerId', operator: '==', value: trainerId }]);
  }

  async update(
    id: string,
    updateClientDto: UpdateClientDto,
    requestingUserId?: string,
    requestingUserRole?: UserRole
  ): Promise<any> {
    const client = await this.clientFirestore.findOne(id);

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    if (requestingUserRole === UserRole.TRAINER && client.trainerId !== requestingUserId) {
      throw new ForbiddenException('You can only update your own clients');
    }

    const updateData: Partial<IClient> = {
      ...updateClientDto,
      updatedAt: Timestamp.now(),
    };

    return await this.clientFirestore.update(id, updateData);
  }

  async linkToUser(clientId: string, userId: string) {
    return await this.clientFirestore.update(clientId, {
      userId,
      status: 'active',
      updatedAt: Timestamp.now(),
    });
  }

  async remove(id: string, requestingUserId?: string, requestingUserRole?: UserRole): Promise<void> {
    const client = await this.clientFirestore.findOne(id);

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    if (requestingUserRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete clients');
    }

    return await this.clientFirestore.delete(id);
  }
}

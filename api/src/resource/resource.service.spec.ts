import { Test, TestingModule } from '@nestjs/testing';
import { ResourceService } from './resource.service';
import { GenericFirestoreService } from '@app/firebase/generic-firestore.service';
import { IResource } from '@app/utils/types/resource.types';
import { CreateResourceDto } from '@app/resource/dto/create-resource.dto';

const mockGenericFirestoreService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('ResourceService', () => {
  let service: ResourceService;
  let genericService: GenericFirestoreService<IResource>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourceService,
        {
          provide: 'RESOURCE_FIRESTORE_SERVICE',
          useValue: mockGenericFirestoreService,
        },
      ],
    }).compile();

    service = module.get<ResourceService>(ResourceService);
    genericService = module.get<GenericFirestoreService<IResource>>('RESOURCE_FIRESTORE_SERVICE');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a resource', async () => {
      const createResourceDto: CreateResourceDto = {
        name: 'Test Room',
        defaultPrice: 100,
        ownerId: 'owner-123',
        minTimeBox: '60',
        clients: [],
      };
      const expectedResponse = { id: '1', ...createResourceDto };

      (genericService.create as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await service.create(createResourceDto);

      expect(result).toEqual(expectedResponse);
      expect(genericService.create).toHaveBeenCalledWith(createResourceDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of resources', async () => {
      const expectedResponse = [{ id: '1', name: 'Test Room', description: 'A room for testing' }];
      (genericService.findAll as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await service.findAll();

      expect(result).toEqual(expectedResponse);
      expect(genericService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single resource', async () => {
      const expectedResponse = { id: '1', name: 'Test Room', description: 'A room for testing' };
      (genericService.findOne as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await service.findOne('1');

      expect(result).toEqual(expectedResponse);
      expect(genericService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a resource', async () => {
      const updateResourceDto = { name: 'Updated Test Room' };
      const expectedResponse = { id: '1', name: 'Updated Test Room', description: 'A room for testing' };

      (genericService.update as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await service.update('1', updateResourceDto);

      expect(result).toEqual(expectedResponse);
      expect(genericService.update).toHaveBeenCalledWith('1', updateResourceDto);
    });
  });

  describe('remove', () => {
    it('should remove a resource', async () => {
      (genericService.delete as jest.Mock).mockResolvedValue(undefined);

      await service.remove('1');

      expect(genericService.delete).toHaveBeenCalledWith('1');
    });
  });
});

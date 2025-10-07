import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { ResourceModule } from '../src/resource/resource.module';
import { FirebaseAuthGuard } from '../src/utils/guards/firebase-auth.guard';
import { RolesGuard } from '../src/utils/guards/role.guard';
import { CreateResourceDto } from '../src/resource/dto/create-resource.dto';
import { UpdateResourceDto } from '../src/resource/dto/update-resource.dto';

describe('ResourceController (e2e)', () => {
  let app: INestApplication;

  const resourceId = 'resource-123';
  const createDto: CreateResourceDto = {
    name: 'Test Room',
    defaultPrice: 100,
    ownerId: 'owner-123',
    minTimeBox: '60',
  };
  const resource = { id: resourceId, ...createDto };

  const mockFirestoreService = {
    create: jest.fn().mockResolvedValue(resource),
    findAll: jest.fn().mockResolvedValue([resource]),
    findOne: jest.fn().mockResolvedValue(resource),
    update: jest.fn().mockResolvedValue({ ...resource, name: 'Updated Name' }),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  const mockAuthGuard = { canActivate: () => true };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ResourceModule],
    })
    .overrideProvider('RESOURCE_FIRESTORE_SERVICE')
    .useValue(mockFirestoreService)
    .overrideGuard(FirebaseAuthGuard)
    .useValue(mockAuthGuard)
    .overrideGuard(RolesGuard)
    .useValue(mockAuthGuard)
    .compile();

    app = moduleFixture.createNestApplication();
    // Add validation pipe to match main.ts
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  it('/resource (GET)', () => {
    return request(app.getHttpServer())
      .get('/resource')
      .expect(200)
      .expect([resource]);
  });

  it('/resource (POST)', () => {
    return request(app.getHttpServer())
      .post('/resource')
      .send(createDto)
      .expect(201)
      .expect(resource);
  });

  it('/resource/:id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/resource/${resourceId}`)
      .expect(200)
      .expect(resource);
  });

  it('/resource/:id (PATCH)', () => {
    const updateDto: UpdateResourceDto = { name: 'Updated Name' };
    return request(app.getHttpServer())
      .patch(`/resource/${resourceId}`)
      .send(updateDto)
      .expect(200)
      .expect({ ...resource, ...updateDto });
  });

  it('/resource/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/resource/${resourceId}`)
      .expect(200);
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { TestGenericService } from './test-generic.service';

describe('TestGenericService', () => {
  let service: TestGenericService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestGenericService],
    }).compile();

    service = module.get<TestGenericService>(TestGenericService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

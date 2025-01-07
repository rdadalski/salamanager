import { Test, TestingModule } from '@nestjs/testing';
import { TestGenericController } from './test-generic.controller';
import { TestGenericService } from './test-generic.service';

describe('TestGenericController', () => {
  let controller: TestGenericController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestGenericController],
      providers: [TestGenericService],
    }).compile();

    controller = module.get<TestGenericController>(TestGenericController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

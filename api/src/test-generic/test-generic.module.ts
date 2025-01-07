import { Module } from '@nestjs/common';
import { TestGenericService } from './test-generic.service';
import { TestGenericController } from './test-generic.controller';

@Module({
  controllers: [TestGenericController],
  providers: [TestGenericService],
})
export class TestGenericModule {}

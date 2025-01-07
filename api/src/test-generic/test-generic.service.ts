import { Injectable } from '@nestjs/common';
import { CreateTestGenericDto } from './dto/create-test-generic.dto';
import { UpdateTestGenericDto } from './dto/update-test-generic.dto';

@Injectable()
export class TestGenericService {
  create(createTestGenericDto: CreateTestGenericDto) {
    return 'This action adds a new testGeneric';
  }

  findAll() {
    return `This action returns all testGeneric`;
  }

  findOne(id: number) {
    return `This action returns a #${id} testGeneric`;
  }

  update(id: number, updateTestGenericDto: UpdateTestGenericDto) {
    return `This action updates a #${id} testGeneric`;
  }

  remove(id: number) {
    return `This action removes a #${id} testGeneric`;
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UpdateTestGenericDto } from './dto/update-test-generic.dto';
import { GenericFirestoreService } from '@app/firebase/generic-firestore.service';
import { FirebaseAuthGuard } from '@app/utils/guards/firebase-auth.guard';
import { RolesGuard } from '@app/utils/guards/role.guard';

interface ITestCrudCollection {
  date: string;
  number: number;
  text: string;
}

@Controller('test-generic')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class TestGenericController {
  constructor(
    private readonly genericFirestore: GenericFirestoreService<ITestCrudCollection>,
  ) {}

  @Post()
  create(@Body() createTestGenericDto: ITestCrudCollection) {
    console.log('Post to test-generic');
    console.log(createTestGenericDto);
    return this.genericFirestore.create(createTestGenericDto);
  }

  @Get()
  findAll() {
    console.log('findAll');
    return this.genericFirestore.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.genericFirestore.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTestGenericDto: UpdateTestGenericDto,
  ) {
    return this.genericFirestore.update(id, updateTestGenericDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.genericFirestore.delete(id);
  }
}

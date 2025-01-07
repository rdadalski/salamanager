import { PartialType } from '@nestjs/mapped-types';
import { CreateTestGenericDto } from './create-test-generic.dto';

export class UpdateTestGenericDto extends PartialType(CreateTestGenericDto) {}

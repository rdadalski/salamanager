import { PartialType } from '@nestjs/swagger';
import { CreateResourceDto } from '@app/resource/dto/create-resource.dto';

export class UpdateResourceDto extends PartialType(CreateResourceDto) {}

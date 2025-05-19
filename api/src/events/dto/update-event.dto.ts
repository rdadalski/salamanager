import { PartialType } from '@nestjs/swagger';
import { CreateInternalEventDto } from './create-event.dto';

export class UpdateInternalEventDto extends PartialType(CreateInternalEventDto) {}

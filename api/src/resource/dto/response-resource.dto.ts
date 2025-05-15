import { ApiProperty } from '@nestjs/swagger';

export class ResourceDto {
  @ApiProperty({
    description: 'Unique identifier of the resource',
    example: 'resource-1',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the resource',
    example: 'BOKS-SOBOTA-9:00',
  })
  name: string;

  @ApiProperty({
    description: 'Default price of the resource',
    example: 150,
  })
  defaultPrice: number;

  @ApiProperty({
    description: 'ID of the resource owner',
    example: 'owner-1',
  })
  ownerId: string;

  @ApiProperty({
    description: 'Minimum time box for the resource',
    example: '2h',
  })
  minTimeBox: string;

  @ApiProperty({
    description: 'Trainees associated with the resource',
  })
  clients: string[];
}

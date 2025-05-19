import { IsString, IsNumber, IsArray, IsNotEmpty, Min, IsOptional, ArrayNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResourceDto {
  @ApiProperty({
    description: 'Name of the resource',
    example: 'BOKS-SOBOTA-9:00',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Default price of the resource',
    example: 150,
  })
  @IsNumber()
  @Min(0)
  defaultPrice: number;

  @ApiProperty({
    description: 'ID of the resource owner',
    example: 'owner-1',
  })
  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @ApiProperty({
    description: 'Minimum time box for the resource',
    example: '2h',
  })
  @IsString()
  @IsNotEmpty()
  minTimeBox: string;

  @ApiProperty({
    description: 'Clients associated with the resource',
  })
  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  clients?: string[];
}

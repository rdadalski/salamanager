import { IsString, IsNumber, IsArray, IsNotEmpty, Min, IsOptional, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Timestamp } from 'firebase-admin/firestore';

export class CreateResourceDto {
  @ApiProperty({ example: '7eof4p73b1p3b2kd459c93sddl' })
  @IsString()
  @IsNotEmpty()
  googleEventId: string;

  @ApiProperty({ example: 'Workout Hyrox' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @Min(0)
  defaultPrice: number;

  @ApiProperty({ example: 'trainer-uuid' })
  @IsString()
  @IsNotEmpty()
  trainerId: string;

  @ApiProperty({ example: ['RRULE:FREQ=WEEKLY;BYDAY=TU,TH'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  recurrence: string[];

  @ApiProperty({ example: '2025-11-20T06:00:00+01:00' })
  @IsString()
  @IsNotEmpty()
  startTime: Timestamp;

  @ApiProperty({ example: '2025-11-20T07:00:00+01:00' })
  @IsString()
  @IsNotEmpty()
  endTime: Timestamp;

  @ApiProperty({ example: '1h' })
  @IsString()
  @IsNotEmpty()
  minTimeBox: string;

  @ApiProperty({ example: ['client-uuid-1', 'client-uuid-2'] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  clients?: string[];

  @ApiProperty({ example: 'calendar-id-123' })
  @IsString()
  @IsNotEmpty()
  calendarId: string;
}

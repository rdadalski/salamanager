import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsISO8601, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { AttendanceStatus } from '@app/utils/types';
import { Type } from 'class-transformer';

export class AttendeeDto {
  @ApiProperty({ description: "The user's unique identifier (UID)" })
  @IsString()
  uid: string;

  @ApiProperty({ description: 'The attendance status of the user', enum: AttendanceStatus })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @ApiProperty({ description: 'Indicates if the user attended the event' })
  @IsBoolean()
  attended: boolean;
}

export class CreateInternalEventDto {
  @ApiProperty({ description: 'Google Calendar event ID' })
  @IsString()
  googleEventId: string;

  @ApiProperty({ description: 'Trainer ID' })
  @IsString()
  trainerId: string;

  @ApiProperty({ description: 'Google Calendar recurring event ID' })
  @IsString()
  googleRecurringEventId: string;

  @ApiProperty({ description: 'Calendar identifier' })
  @IsString()
  calendarId: string;

  @ApiProperty({ description: 'Resource identifier' })
  @IsString()
  resourceId: string;

  @ApiProperty({ description: 'Event summary/title' })
  @IsString()
  summary: string;

  @ApiPropertyOptional({ description: 'Optional display title for the event' })
  @IsOptional()
  @IsString()
  displayTitle?: string;

  @ApiProperty({ description: 'Event start time in ISO 8601 format' })
  @IsISO8601()
  startTime: string;

  @ApiProperty({ description: 'Event end time in ISO 8601 format' })
  @IsISO8601()
  endTime: string;

  @ApiProperty({ description: 'Status of the event' })
  @IsString()
  status: string;

  @ApiProperty({ description: 'Default resource price for the event' })
  @IsNumber()
  defaultResourcePrice: number;

  @ApiProperty({
    description: 'List of attendees for the event',
    type: AttendeeDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendeeDto)
  attendees: AttendeeDto[];
}

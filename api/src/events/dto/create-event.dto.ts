import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsISO8601, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInternalEventDto {
  @ApiProperty({ description: 'Google Calendar event ID' })
  @IsString()
  googleEventId: string;

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

  @ApiProperty({ description: 'List of client identifiers', type: [String] })
  @IsArray()
  @IsString({ each: true })
  clients: string[];
}

import { IsString, IsNotEmpty, IsOptional, IsArray, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DateTimeDTO {
  @IsString()
  @IsNotEmpty()
  dateTime: string;

  @IsString()
  @IsOptional()
  timeZone?: string;
}

class AttendeeDTO {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  displayName?: string;
}

class ReminderOverrideDTO {
  @IsString()
  method: 'email' | 'popup';

  @IsNotEmpty()
  minutes: number;
}

class RemindersDTO {
  @IsNotEmpty()
  useDefault: boolean;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ReminderOverrideDTO)
  overrides?: ReminderOverrideDTO[];
}

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  summary: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => DateTimeDTO)
  start: DateTimeDTO;

  @IsObject()
  @ValidateNested()
  @Type(() => DateTimeDTO)
  end: DateTimeDTO;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AttendeeDTO)
  attendees?: AttendeeDTO[];

  @IsString()
  @IsOptional()
  sendUpdates?: 'all' | 'externalOnly' | 'none';

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => RemindersDTO)
  reminders?: RemindersDTO;
}

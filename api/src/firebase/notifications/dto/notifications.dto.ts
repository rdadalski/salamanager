import { IsString, IsOptional, IsArray, IsObject } from 'class-validator';

export class DeviceTokenDto {
  @IsString()
  userId: string;

  @IsString()
  token: string;

  @IsObject()
  @IsOptional()
  deviceData?: {
    platform: string;
    deviceId: string;
    [key: string]: any;
  };
}

export class SendNotificationDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  token?: string;

  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
}

export class SendMulticastNotificationDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsArray()
  @IsString({ each: true })
  userIds: string[];

  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
}

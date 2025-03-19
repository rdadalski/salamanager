import { IsEmail, IsNotEmpty, IsString, IsOptional, IsIn, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserRequestDto {
  @IsNotEmpty()
  @IsString()
  uid: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  displayName: string | null;

  @IsOptional()
  @IsString()
  phoneNumber: string | null;

  @IsOptional()
  @IsString()
  password: string | null;

  @IsOptional()
  @IsString()
  photoURL: string | null;

  // @IsNotEmpty()
  // @IsString()
  // @IsIn(['password', 'google.com'])
  // authProvider: 'password' | 'google.com';

  @IsString()
  @IsOptional()
  serverAuthCode?: string;
}

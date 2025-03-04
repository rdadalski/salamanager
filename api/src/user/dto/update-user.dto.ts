import { IsEmail, IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  displayName?: string | null;

  @IsOptional()
  @IsString()
  photoURL?: string | null;

  @IsOptional()
  @IsString()
  @IsIn(['password', 'google.com'])
  authProvider?: 'password' | 'google.com';
}

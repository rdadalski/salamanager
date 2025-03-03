import { IsEmail, IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
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

  @IsNotEmpty()
  @IsString()
  @IsIn(['password', 'google.com'])
  authProvider: 'password' | 'google.com';
}

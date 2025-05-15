import { IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '@app/user/models/user.model';
import { ApiProperty } from '@nestjs/swagger';

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

  @IsNotEmpty()
  @IsEnum(UserRole)
  @ApiProperty({
    description: 'User role in the system',
    enum: UserRole,
    example: UserRole.CLIENT,
  })
  role: UserRole;

  // @IsNotEmpty()
  // @IsString()
  // @IsIn(['password', 'google.com'])
  // authProvider: 'password' | 'google.com';

  @IsString()
  @IsOptional()
  serverAuthCode?: string;
}

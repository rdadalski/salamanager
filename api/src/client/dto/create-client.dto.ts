import { IsString, IsEmail, IsPhoneNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('PL')
  phone: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  trainerId: string;

  @IsOptional()
  @IsEnum(['active', 'inactive', 'pending'])
  status?: 'active' | 'inactive' | 'pending';
}
